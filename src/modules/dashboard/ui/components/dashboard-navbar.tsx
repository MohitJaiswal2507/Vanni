"use client";

import { useEffect, useState } from "react";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button 
          className="size-9 bg-[#F8F5EF] hover:bg-[#F8F5EF] text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] rounded-xl transition-all duration-150 cursor-pointer p-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#412D15]/20 focus-visible:ring-offset-0 focus-visible:outline-none select-none" 
          variant="outline" 
          onClick={toggleSidebar}
        >
          {(state === "collapsed" || isMobile) 
            ?  <PanelLeftIcon className="size-4 text-[#1F150C]" /> 
            : <PanelLeftCloseIcon className="size-4 text-[#1F150C]" />
          }
        </Button>
        <Button
          className="h-9 w-[240px] justify-start font-bold text-[#1F150C] hover:text-[#1F150C] bg-[#F8F5EF] hover:bg-[#F8F5EF] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] rounded-xl transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#412D15]/20 focus-visible:ring-offset-0 focus-visible:outline-none select-none group"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon className="size-4 mr-2 text-[#412D15] opacity-75 group-hover:opacity-100 transition-opacity duration-150" />
          <span className="text-sm font-semibold tracking-tight text-[#1F150C]/90">Search</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-lg border-2 border-[#412D15] bg-[#F5F1E8] px-1.5 font-mono text-[9px] font-extrabold text-[#1F150C] shadow-[1px_1px_0px_0px_#412D15] leading-none">
            <span className="text-[10px] leading-none">&#8984;</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};