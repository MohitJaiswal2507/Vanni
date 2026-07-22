import Link from "next/link";
import Markdown from "react-markdown";
import {
  SparklesIcon,
  FileTextIcon,
  BookOpenTextIcon,
  FileVideoIcon,
  ClockFadingIcon,
} from "lucide-react";
import { format } from "date-fns";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MeetingGetOne } from "../../types";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-[#F8F5EF] border-2 border-[#412D15] rounded-[20px] px-3 py-1 shadow-[3px_3px_0px_0px_#412D15] select-none">
          <ScrollArea>
             <TabsList className="p-0 bg-transparent justify-start rounded-none h-13 gap-x-2 border-0">
                <TabsTrigger
                  value="summary"
                  className="text-[#6B5C4C] rounded-lg bg-transparent border border-transparent font-bold data-[state=active]:bg-[#1F150C] data-[state=active]:text-[#FFFFFF] data-[state=active]:border-[#412D15] data-[state=active]:shadow-[1.5px_1.5px_0px_0px_#412D15] hover:bg-[#D8D1BE]/40 hover:text-[#1F150C] px-4 py-2 transition-all duration-200 gap-x-2 cursor-pointer h-9 text-sm"
                >
                  <BookOpenTextIcon className="size-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="transcript"
                  className="text-[#6B5C4C] rounded-lg bg-transparent border border-transparent font-bold data-[state=active]:bg-[#1F150C] data-[state=active]:text-[#FFFFFF] data-[state=active]:border-[#412D15] data-[state=active]:shadow-[1.5px_1.5px_0px_0px_#412D15] hover:bg-[#D8D1BE]/40 hover:text-[#1F150C] px-4 py-2 transition-all duration-200 gap-x-2 cursor-pointer h-9 text-sm"
                >
                  <FileTextIcon className="size-4" />
                  Transcript
                </TabsTrigger>
                <TabsTrigger
                  value="recording"
                  className="text-[#6B5C4C] rounded-lg bg-transparent border border-transparent font-bold data-[state=active]:bg-[#1F150C] data-[state=active]:text-[#FFFFFF] data-[state=active]:border-[#412D15] data-[state=active]:shadow-[1.5px_1.5px_0px_0px_#412D15] hover:bg-[#D8D1BE]/40 hover:text-[#1F150C] px-4 py-2 transition-all duration-200 gap-x-2 cursor-pointer h-9 text-sm"
                >
                  <FileVideoIcon className="size-4" />
                  Recording
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="text-[#6B5C4C] rounded-lg bg-transparent border border-transparent font-bold data-[state=active]:bg-[#1F150C] data-[state=active]:text-[#FFFFFF] data-[state=active]:border-[#412D15] data-[state=active]:shadow-[1.5px_1.5px_0px_0px_#412D15] hover:bg-[#D8D1BE]/40 hover:text-[#1F150C] px-4 py-2 transition-all duration-200 gap-x-2 cursor-pointer h-9 text-sm"
                >
                  <SparklesIcon className="size-4" />
                  Ask AI
                </TabsTrigger>
             </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="chat" className="focus-visible:outline-none">
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
        <TabsContent value="transcript" className="focus-visible:outline-none">
          <Transcript meetingId={data.id} />
        </TabsContent>
        <TabsContent value="recording" className="focus-visible:outline-none">
          <div className="bg-[#F8F5EF] border-2 border-[#412D15] shadow-[6px_6px_0px_0px_#412D15] rounded-[24px] p-5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#412D15] transition-all duration-300">
            <video
              src={data.recordingUrl!}
              className="w-full rounded-2xl border border-[#412D15]/20 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)]"
              controls
            />
          </div>
        </TabsContent>
        <TabsContent value="summary" className="focus-visible:outline-none">
          <div className="bg-[#F8F5EF] border-2 border-[#412D15] shadow-[6px_6px_0px_0px_#412D15] rounded-[24px] p-6 md:p-8 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#412D15] transition-all duration-300">
            <div className="flex flex-col gap-y-6">
              
              {/* Premium overview block details */}
              <div className="border-b border-[#412D15]/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-y-1.5">
                  <h2 className="text-3xl font-extrabold text-[#1F150C] capitalize leading-tight">{data.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B5C4C] font-semibold">
                    <Link
                      href={`/agents/${data.agent.id}`}
                      className="flex items-center gap-x-1.5 hover:underline decoration-2 text-[#1F150C] font-bold"
                    >
                      <GeneratedAvatar
                        variant="botttsNeutral"
                        seed={data.agent.name}
                        className="size-5 border border-[#412D15] rounded-full bg-[#F8F5EF] shadow-[1px_1px_0px_0px_#412D15]"
                      />
                      {data.agent.name}
                    </Link>{" "}
                    <span>•</span>
                    <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 [&>svg]:size-4 px-3.5 py-1.5 bg-[#F5F1E8] border-2 border-[#412D15] shadow-[2.5px_2.5px_0px_0px_#412D15] rounded-lg text-[#1F150C] font-bold w-fit shrink-0 self-start md:self-center"
                >
                  <ClockFadingIcon className="text-[#6B5C4C]" />
                  {data.duration ? formatDuration(data.duration) : "No duration"}
                </Badge>
              </div>

              {/* General summary card title */}
              <div className="flex gap-x-2 items-center bg-[#E1DCC9] border-2 border-[#412D15] shadow-[2.5px_2.5px_0px_0px_#412D15] rounded-xl px-4 py-2 text-[#1F150C] font-bold w-fit text-sm">
                <SparklesIcon className="size-4 text-[#1F150C]" />
                <p>General summary</p>
              </div>

              {/* Notion-style markdown content */}
              <div className="text-[#1F150C] leading-relaxed max-w-none font-medium prose prose-stone select-text">
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="text-2xl font-extrabold text-[#1F150C] mt-8 mb-4 border-b border-[#412D15]/10 pb-2" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="text-xl font-bold text-[#1F150C] mt-8 mb-3" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="text-lg font-bold text-[#1F150C] mt-6 mb-2" {...props} />
                    ),
                    p: (props) => (
                      <p className="mb-4 text-[#1F150C]/90 leading-loose text-base" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="list-disc list-inside mb-4 pl-2 space-y-2 text-[#1F150C]/95" {...props} />
                    ),
                    ol: (props) => (
                      <ol className="list-decimal list-inside mb-4 pl-2 space-y-2 text-[#1F150C]/95" {...props} />
                    ),
                    li: (props) => <li className="pl-1 mb-1" {...props} />,
                    strong: (props) => (
                      <strong className="font-extrabold text-[#1F150C]" {...props} />
                    ),
                    code: (props) => (
                      <code
                        className="bg-[#E1DCC9]/40 border border-[#412D15]/20 text-[#1F150C] px-1.5 py-0.5 rounded font-mono text-sm"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 border-[#412D15] pl-4 italic my-4 text-[#6B5C4C]"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};