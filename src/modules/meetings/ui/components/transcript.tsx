import { useState } from "react";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
  meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }))

  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = (data ?? []).filter((item) =>
    item.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F8F5EF] border-2 border-[#412D15] shadow-[6px_6px_0px_0px_#412D15] rounded-[24px] p-6 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#412D15] transition-all duration-300 flex flex-col gap-y-6 w-full">
      <h5 className="font-extrabold text-lg text-[#1F150C]">Transcript</h5>
      
      <div className="relative">
        <Input
          placeholder="Search Transcript..."
          className="pl-8 h-9 bg-[#F5F1E8] border-2 border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/30 focus-visible:border-[#412D15] transition-all duration-200 w-[260px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6B5C4C]" />
      </div>
      
      <div className="overflow-y-auto max-h-[500px] pr-2 flex flex-col gap-y-4">
        {filteredData.map((item) => {
          return (
            <div
              key={item.start_ts}
              className="flex flex-col gap-y-3.5 bg-[#F5F1E8] border-2 border-[#412D15]/15 hover:border-[#412D15] p-5 rounded-2xl shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.02),2px_2px_0px_0px_rgba(65,45,21,0.05)] hover:shadow-[3px_3px_0px_0px_#412D15] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex gap-x-2.5 items-center">
                <Avatar className="size-7 border-2 border-[#412D15] shadow-[1px_1px_0px_0px_#412D15] rounded-full overflow-hidden bg-[#F8F5EF]">
                  <AvatarImage
                    src={item.user.image ?? generateAvatarUri({ seed: item.user.name, variant: "initials" })}
                    alt="User Avatar"
                  />
                </Avatar>
                <p className="text-sm font-bold text-[#1F150C]">{item.user.name}</p>
                
                <span className="bg-[#E1DCC9] border border-[#412D15]/25 text-[#1F150C] text-[10px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]">
                  {format(
                    new Date(0, 0, 0, 0, 0, 0, item.start_ts),
                    "mm:ss"
                  )}
                </span>
              </div>
              
              <Highlighter
                className="text-sm text-[#1F150C]/90 font-medium leading-relaxed"
                highlightClassName="bg-[#C98928]/25 text-[#1F150C] font-semibold px-0.5 rounded"
                searchWords={[searchQuery]}
                autoEscape={true}
                textToHighlight={item.text}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
};