import Link from "next/link";
import { RocketIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";

import {
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
} from "@/modules/premium/constants";

export const DashboardTrial = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

  if (!data) return null;

  return (
    <div className="bg-[#F8F5EF] border-2 border-[#412D15] shadow-[3px_3px_0px_0px_#412D15] rounded-2xl w-full p-4 flex flex-col gap-y-3 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#412D15] transition-all duration-300 select-none text-[#1F150C] font-sans">
      <div className="flex items-center gap-2">
        <RocketIcon className="size-4 text-[#1F150C]" />
        <p className="text-sm font-black tracking-tight">Free Trial</p>
      </div>
      
      <div className="flex flex-col gap-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span>Agents</span>
          <span>{data.agentCount}/{MAX_FREE_AGENTS}</span>
        </div>
        <div className="w-full bg-[#F5F1E8] border-2 border-[#412D15] h-3 rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
          <div 
            className="bg-[#1F150C] h-full transition-all duration-300" 
            style={{ width: `${Math.min((data.agentCount / MAX_FREE_AGENTS) * 100, 100)}%` }} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span>Meetings</span>
          <span>{data.meetingCount}/{MAX_FREE_MEETINGS}</span>
        </div>
        <div className="w-full bg-[#F5F1E8] border-2 border-[#412D15] h-3 rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
          <div 
            className="bg-[#1F150C] h-full transition-all duration-300" 
            style={{ width: `${Math.min((data.meetingCount / MAX_FREE_MEETINGS) * 100, 100)}%` }} 
          />
        </div>
      </div>

      <Button
        className="w-full bg-[#1F150C] hover:bg-[#322316] text-[#FFFFFF] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] rounded-xl py-2.5 text-xs font-black transition-all duration-150 mt-1 cursor-pointer"
        asChild
      >
        <Link href="/upgrade">
          Upgrade to PRO
        </Link>
      </Button>
    </div>
  );
};