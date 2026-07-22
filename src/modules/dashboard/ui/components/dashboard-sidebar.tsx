"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HomeIcon, BotIcon, StarIcon, VideoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { DashboardTrial } from "./dashboard-trial";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: HomeIcon,
    label: "Home",
    href: "/",
  },
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const sidebarStyles = {
    "--sidebar": "#E1DCC9",
    "--sidebar-foreground": "#1F150C",
    "--sidebar-border": "#412D15",
    "--sidebar-accent": "#F8F5EF",
    "--sidebar-accent-foreground": "#1F150C",
  } as React.CSSProperties;

  return (
    <Sidebar 
      style={sidebarStyles} 
      className="border-r-2 border-r-[#412D15] bg-[#E1DCC9]"
    >
      {/* 1. LOGO SECTION */}
      <SidebarHeader className="p-4">
        <Link 
          href="/" 
          className="flex items-center gap-x-3 bg-[#F8F5EF] border-2 border-[#412D15] shadow-[3px_3px_0px_0px_#412D15] rounded-xl px-4 py-3 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#412D15] transition-all duration-300 select-none cursor-pointer group animate-fade-in"
        >
          <div className="shrink-0 relative group-hover:rotate-6 transition-transform duration-300">
            <Image 
              src="/logo.svg" 
              height={32} 
              width={32} 
              alt="Vanni AI" 
              priority
            />
          </div>
          <p className="text-lg font-black tracking-tight text-[#1F150C]">VANNI AI</p>
        </Link>
      </SidebarHeader>

      {/* Subtle Separator */}
      <div className="h-[1px] bg-[#412D15]/15 mx-4 my-2" />

      <SidebarContent className="px-3 gap-y-6">
        {/* 2. NAVIGATION SECTION */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-4">
              {firstSection.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-12 w-full rounded-xl transition-all duration-200 p-3.5 flex items-center gap-x-3.5 cursor-pointer group select-none border-2",
                        isActive
                          ? "bg-[#F8F5EF] text-[#412D15] border-[#412D15] font-extrabold shadow-[3px_3px_0px_0px_#412D15] translate-y-[-1px]"
                          : "bg-transparent text-[#6B5C4C] border-transparent hover:bg-[#F8F5EF] hover:text-[#1F150C] hover:border-[#412D15]/30 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#412D15]"
                      )}
                      isActive={isActive}
                    >
                      <Link href={item.href}>
                        <item.icon 
                          className={cn(
                            "size-5 transition-transform duration-200 group-hover:scale-110 shrink-0",
                            isActive ? "text-[#412D15] stroke-[2.5]" : "text-[#6B5C4C] group-hover:text-[#1F150C]"
                          )} 
                          stroke="currentColor"
                          fill="none"
                        />
                        <span className="text-sm tracking-tight">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Subtle Separator */}
        <div className="h-[1px] bg-[#412D15]/15 mx-4 my-2" />

        {/* 3. UPGRADE MONETIZATION SECTION */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-12 w-full rounded-xl border-2 border-[#412D15] font-extrabold p-3.5 transition-all duration-200 flex items-center justify-between cursor-pointer select-none bg-[#F8F5EF] shadow-[3px_3px_0px_0px_#412D15] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#412D15]"
                      )}
                      isActive={isActive}
                    >
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-x-3.5">
                          <item.icon className="size-5 shrink-0 text-[#1F150C]" />
                          <span className="text-sm tracking-tight text-[#1F150C]">
                            {item.label}
                          </span>
                        </div>
                        <span className="bg-[#1F150C] text-[#F8F5EF] text-[9px] font-black uppercase px-2 py-0.5 rounded border border-[#412D15] shadow-[1px_1px_0px_0px_#F8F5EF] shrink-0">
                          PRO
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Subtle Separator */}
      <div className="h-[1px] bg-[#412D15]/15 mx-4 my-2" />

      {/* 5. FOOTER & PROFILE SECTION */}
      <SidebarFooter className="p-3 gap-y-4">
        <DashboardTrial />
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};