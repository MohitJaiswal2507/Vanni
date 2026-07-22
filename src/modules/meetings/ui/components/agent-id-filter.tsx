import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const trpc = useTRPC();

  const [agentSearch, setAgentSearch] = useState("");
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  return (
    <CommandSelect
      className="h-9 bg-[#F8F5EF] border-2 border-[#412D15] rounded-xl text-[#1F150C] shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] hover:bg-[#D8D1BE]/40 focus:ring-2 focus:ring-[#412D15]/30 focus:border-[#412D15] transition-all duration-200 gap-x-2 [&_svg]:text-[#1F150C]/75"
      placeholder="Agent"
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4 border border-[#412D15] rounded-full overflow-hidden"
            />
            {agent.name}
          </div>
        )
      }))}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
    />
  )
};