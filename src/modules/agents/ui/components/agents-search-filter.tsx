import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useAgentsFilters } from "../../hooks/use-agents-filters";

export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters();

  return (
    <div className="relative">
      <Input
        placeholder="Filter by name"
        className="h-9 bg-[#F8F5EF] border-2 border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/30 focus-visible:border-[#412D15] transition-all duration-200 w-50 pl-8"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5C4C]" />
    </div>
  );
};