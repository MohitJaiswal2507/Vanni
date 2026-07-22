import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";

import "stream-chat-react/dist/css/v2/index.css";

interface ChatUIProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string | undefined;
};

export const ChatUI = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: ChatUIProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions(),
  );

  const [channel, setChannel] = useState<StreamChannel>();
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: generateChatToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });

  useEffect(() => {
    if (!client) return;

    const channel = client.channel("messaging", meetingId, {
      members: [userId],
    });

    setChannel(channel);
  }, [client, meetingId, meetingName, userId]);

  // Programmatic scroll-to-bottom on new messages and stream updates
  useEffect(() => {
    if (!client || !channel) return;

    const scrollToBottom = () => {
      setTimeout(() => {
        const scrollContainer = document.querySelector(".str-chat__list");
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    };

    // Scroll on mount / channel change
    scrollToBottom();

    client.on("message.new", scrollToBottom);
    client.on("typing.start", scrollToBottom);

    return () => {
      client.off("message.new", scrollToBottom);
      client.off("typing.start", scrollToBottom);
    };
  }, [client, channel]);

  if (!client) {
    return (
      <LoadingState
        title="Loading Chat"
        description="This may take a few seconds"
      />
    );
  }

  const chatThemeStyles = {
    "--str-chat__background-color": "#F8F5EF",
    "--str-chat__border-color": "#412D15",
    "--str-chat__primary-color": "#1F150C",
    "--str-chat__active-primary-color": "#1F150C",
    "--str-chat__body-text-color": "#1F150C",
    "--str-chat__secondary-text-color": "#6B5C4C",
    "--str-chat__message-bubble-background-color-other": "#F5F1E8",
    "--str-chat__message-bubble-background-color-own": "#E1DCC9",
    "--str-chat__message-bubble-border-radius": "16px",
    "--str-chat__message-input-background-color": "#F5F1E8",
    "--str-chat__message-input-border-color": "#412D15",
  } as React.CSSProperties;

  return (
    <div 
      className="bg-[#F8F5EF] border-2 border-[#412D15] shadow-[6px_6px_0px_0px_#412D15] rounded-[24px] overflow-hidden hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#412D15] transition-all duration-300"
      style={chatThemeStyles}
    >
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <div className="h-[480px] border-b border-[#412D15]/10 bg-[#F8F5EF] relative">
              <MessageList />
            </div>
            <div className="p-3 bg-[#F8F5EF]">
              <MessageInput />
            </div>
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}