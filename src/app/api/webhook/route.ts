import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { geminiClient, GEMINI_CHAT_MODEL } from "@/lib/gemini";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import {
  MessageNewEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
  CallRecordingStartedEvent,
  CallSessionParticipantLeftEvent,
  CallSessionParticipantJoinedEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";


function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let eventName = "unknown";
  try {
    eventName = JSON.parse(body)?.type ?? "unknown";
  } catch {}

  const valid = verifySignatureWithSDK(body, signature);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    console.log("Meeting ID:", meetingId);

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing")),
        )
      );

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const workerUrl =
      process.env.AGENT_WORKER_URL ?? "http://localhost:8787";

    console.log("Calling worker:", `${workerUrl}/join`);
    try {
      const res = await fetch(`${workerUrl}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_type: "default",
          call_id: meetingId,
          agent_id: existingAgent.id,
          agent_name: existingAgent.name,
          instructions: existingAgent.instructions,
        }),
      });
      const responseText = await res.text();

      console.log("Worker response:", responseText);

      if (!res.ok) {
        console.error(responseText);
      }
    } catch (err) {
      console.error(err);
    }
  } else if (eventType === "call.session_participant_joined") {
    // Fallback trigger: fires for every participant join.
    // meetingId is embedded in call_cid as "default:<meetingId>".
    const event = payload as CallSessionParticipantJoinedEvent;
    const meetingId = event.call_cid.split(":")[1];
    const participantUserId = event.participant?.user?.id;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    // Only proceed when the meeting is still upcoming (not yet activated).
    // This prevents a double-join if call.session_started already ran first.
    const [upcomingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing")),
        )
      );

    if (!upcomingMeeting) {
      // Already active or doesn't exist — silently ignore.
      return NextResponse.json({ status: "ok" });
    }

    // Skip if the joining participant is the AI agent itself (avoid re-entrancy).
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, upcomingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (participantUserId === existingAgent.id) {
      return NextResponse.json({ status: "ok" });
    }

    console.log("Meeting ID:", meetingId);

    // Mark meeting active.
    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, upcomingMeeting.id));

    const workerUrl = process.env.AGENT_WORKER_URL ?? "http://localhost:8787";
    console.log("Calling worker:", `${workerUrl}/join`);

    try {
      const res = await fetch(`${workerUrl}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_type: "default",
          call_id: meetingId,
          agent_id: existingAgent.id,
          agent_name: existingAgent.name,
          instructions: existingAgent.instructions,
        }),
      });
      const responseText = await res.text();
      console.log("Worker response:", responseText);
      if (!res.ok) {
        console.error("Worker error:", responseText);
      }
    } catch (err) {
      console.error("Worker fetch failed:", err);
    }
  } else if (eventType === "call.recording_started") {
    // call.recording_started is CONFIRMED arriving in logs (unlike call.session_started
    // and call.session_participant_joined which are not subscribed in the Stream Dashboard).
    // It fires at the same moment the session starts (triggered by the first participant
    // joining with recording mode: auto-on) and always carries call_cid.
    const event = payload as CallRecordingStartedEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    // Status guard: only join if meeting is still upcoming.
    // Prevents double-join if call.session_started also fires (once enabled in Dashboard).
    const [upcomingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing")),
        )
      );

    if (!upcomingMeeting) {
      return NextResponse.json({ status: "ok" });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, upcomingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    console.log("Meeting ID:", meetingId);

    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, upcomingMeeting.id));

    const workerUrl = process.env.AGENT_WORKER_URL ?? "http://localhost:8787";
    console.log("Calling worker:", `${workerUrl}/join`);

    try {
      const res = await fetch(`${workerUrl}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_type: "default",
          call_id: meetingId,
          agent_id: existingAgent.id,
          agent_name: existingAgent.name,
          instructions: existingAgent.instructions,
        }),
      });
      const responseText = await res.text();
      console.log("Worker response:", responseText);
      if (!res.ok) {
        console.error("Worker error:", responseText);
      }
    } catch (err) {
      console.error("Worker fetch failed:", err);
    }
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({
        status: "processing",
        endedAt: new Date(),
      })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updatedMeeting.id,
        transcriptUrl: updatedMeeting.transcriptUrl,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(meetings.id, meetingId));
      } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;

    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (userId !== existingAgent.id) {
      const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `;

      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>((message) => ({
          role: message.user?.id === existingAgent.id ? "assistant" : "user",
          content: message.text || "",
        }));

      const response = await geminiClient.chat.completions.create({
        model: GEMINI_CHAT_MODEL,
        messages: [
          {
            role: "system",
            content: instructions,
          },
          ...previousMessages,
          {
            role: "user",
            content: text,
          },
        ],
      });

      const GPTResponseText = response.choices[0].message.content;

      if (!GPTResponseText) {
        return NextResponse.json(
          { error: "No response from GPT" },
          { status: 400 }
        );
      }

      const avatarUrl = generateAvatarUri({
        seed: existingAgent.name,
        variant: "botttsNeutral",
      });

      streamChat.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      });

      channel.sendMessage({
        text: GPTResponseText,
        user: {
          id: existingAgent.id,
          name: existingAgent.name,
          image: avatarUrl,
        },
      });
    }
    }

  return NextResponse.json({ status: "ok" });
}