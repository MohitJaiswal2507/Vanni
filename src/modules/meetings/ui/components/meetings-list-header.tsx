"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";
import { Button } from "@/components/ui/button";

import { NewMeetingDialog } from "./new-meeting-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-extrabold text-2xl md:text-3xl text-[#1F150C]">My Meetings</h5>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#1F150C] hover:bg-[#322316] text-[#FFFFFF] border-2 border-[#412D15] shadow-[3px_3px_0px_0px_#412D15] hover:shadow-[1px_1px_0px_0px_#412D15] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] rounded-xl px-4 py-2.5 font-bold transition-all duration-150 flex items-center justify-center gap-x-2 cursor-pointer h-9"
          >
            <PlusIcon className="size-4" />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button 
                onClick={onClearFilters}
                className="bg-[#E1DCC9] hover:bg-[#D8D1BE] text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 flex items-center justify-center gap-x-2 cursor-pointer h-9"
              >
                <XCircleIcon className="size-4 text-[#1F150C]" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};