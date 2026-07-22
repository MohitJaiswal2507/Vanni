"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { 
  BotIcon, 
  VideoIcon, 
  ClockIcon, 
  SparklesIcon, 
  ZapIcon, 
  PlusIcon,
  CalendarIcon,
  ChevronRightIcon
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data: sessionData } = authClient.useSession();
  const userName = sessionData?.user?.name || "Explorer";

  // Fetch real statistics
  const { data: meetingsData, isLoading: meetingsLoading } = useQuery(
    trpc.meetings.getMany.queryOptions({ page: 1, pageSize: 100 })
  );
  
  const { data: agentsData, isLoading: agentsLoading } = useQuery(
    trpc.agents.getMany.queryOptions({ page: 1, pageSize: 100 })
  );

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculations for stats
  const totalMeetings = meetingsData?.total ?? 0;
  const totalAgents = agentsData?.total ?? 0;
  const totalSeconds = meetingsData?.items?.reduce((sum, item) => {
    const duration = Number(item.duration);
    return sum + (isNaN(duration) ? 0 : duration);
  }, 0) || 0;
  const totalMinutes = Math.round(totalSeconds / 60);

  // Common card style classes
  const cardBase = "bg-[#F8F5EF] border-[3px] border-[#412D15] shadow-[6px_6px_0px_0px_#412D15] rounded-[24px] p-6 hover:-translate-y-1 hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#412D15] transition-all duration-300";
  const btnPrimary = "bg-[#1F150C] hover:bg-[#322316] text-[#FFFFFF] border-[3px] border-[#412D15] shadow-[4px_4px_0px_0px_#412D15] hover:shadow-[2px_2px_0px_0px_#412D15] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-xl px-6 py-3 font-bold flex items-center justify-center gap-x-2 cursor-pointer";
  const btnSecondary = "bg-[#E1DCC9] hover:bg-[#D8D1BE] text-[#1F150C] border-[3px] border-[#412D15] shadow-[4px_4px_0px_0px_#412D15] hover:shadow-[2px_2px_0px_0px_#412D15] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-xl px-6 py-3 font-bold flex items-center justify-center gap-x-2 cursor-pointer";

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F1E8] text-[#1F150C] font-sans pb-16 px-4 md:px-8">
      
      {/* SECTION 1: HERO */}
      <section className="max-w-4xl mx-auto text-center pt-16 pb-12">
        <div className="inline-flex items-center gap-x-2 bg-[#E1DCC9] border-2 border-[#412D15] px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-[2px_2px_0px_0px_#412D15] text-[#1F150C]">
          <span>✨</span>
          <span>Welcome back, {userName}!</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          {getGreeting()}, <br className="md:hidden" />
          <span className="underline decoration-[4px] decoration-[#412D15] underline-offset-8">
            {userName}
          </span> 👋
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-[#1F150C]/80 mb-6">
          Your AI Meeting Workspace
        </h2>
        
        <p className="text-base md:text-lg text-[#6B5C4C] max-w-xl mx-auto mb-10 font-medium">
          Manage AI agents, schedule intelligent meetings and generate insights automatically.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/meetings" className={btnPrimary}>
            <VideoIcon className="size-5" />
            Start Meeting
          </Link>
          <Link href="/agents" className={btnSecondary}>
            <BotIcon className="size-5" />
            Your Agents
          </Link>
        </div>
      </section>

      {/* SECTION 2: STATISTICS */}
      <section className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: My Agents */}
          <div className={cardBase}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#6B5C4C]">My Agents</span>
              <div className="p-3 bg-[#E1DCC9] border-2 border-[#412D15] rounded-xl shadow-[2px_2px_0px_0px_#412D15]">
                <BotIcon className="size-5 text-[#1F150C]" />
              </div>
            </div>
            {agentsLoading ? (
              <div className="h-10 w-24 bg-[#E1DCC9] animate-pulse rounded-lg border-2 border-[#412D15]/20"></div>
            ) : (
              <div className="text-4xl font-extrabold tracking-tight mb-1">{totalAgents}</div>
            )}
            <p className="text-sm font-medium text-[#6B5C4C] mt-2">Active AI companions</p>
          </div>

          {/* Card 2: Total Minutes */}
          <div className={cardBase}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#6B5C4C]">Total Minutes</span>
              <div className="p-3 bg-[#E1DCC9] border-2 border-[#412D15] rounded-xl shadow-[2px_2px_0px_0px_#412D15]">
                <ClockIcon className="size-5 text-[#1F150C]" />
              </div>
            </div>
            {meetingsLoading ? (
              <div className="h-10 w-24 bg-[#E1DCC9] animate-pulse rounded-lg border-2 border-[#412D15]/20"></div>
            ) : (
              <div className="text-4xl font-extrabold tracking-tight mb-1">{totalMinutes} mins</div>
            )}
            <p className="text-sm font-medium text-[#6B5C4C] mt-2">Meeting time recorded</p>
          </div>

          {/* Card 3: Meetings */}
          <div className={cardBase}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#6B5C4C]">Meetings</span>
              <div className="p-3 bg-[#E1DCC9] border-2 border-[#412D15] rounded-xl shadow-[2px_2px_0px_0px_#412D15]">
                <CalendarIcon className="size-5 text-[#1F150C]" />
              </div>
            </div>
            {meetingsLoading ? (
              <div className="h-10 w-24 bg-[#E1DCC9] animate-pulse rounded-lg border-2 border-[#412D15]/20"></div>
            ) : (
              <div className="text-4xl font-extrabold tracking-tight mb-1">{totalMeetings}</div>
            )}
            <p className="text-sm font-medium text-[#6B5C4C] mt-2">Scheduled & Completed</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="max-w-5xl mx-auto mb-16">
        <h3 className="text-2xl md:text-3xl font-extrabold text-center mb-10">
          Powerful Features
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: AI Agents */}
          <div className={cardBase}>
            <div className="p-3 bg-[#E1DCC9] border-2 border-[#412D15] rounded-2xl w-fit shadow-[3px_3px_0px_0px_#412D15] mb-5">
              <BotIcon className="size-6 text-[#1F150C]" />
            </div>
            <h4 className="text-lg font-bold mb-2">AI Agents</h4>
            <p className="text-sm text-[#6B5C4C] mb-6 leading-relaxed font-medium">
              Create and manage intelligent AI agents tailored to your needs.
            </p>
            <Link href="/agents" className="inline-flex items-center gap-x-1.5 text-sm font-extrabold hover:underline text-[#1F150C]">
              Explore <ChevronRightIcon className="size-4" />
            </Link>
          </div>

          {/* Feature 2: Meetings */}
          <div className={cardBase}>
            <div className="p-3 bg-[#E1DCC9] border-2 border-[#412D15] rounded-2xl w-fit shadow-[3px_3px_0px_0px_#412D15] mb-5">
              <VideoIcon className="size-6 text-[#1F150C]" />
            </div>
            <h4 className="text-lg font-bold mb-2">Meetings</h4>
            <p className="text-sm text-[#6B5C4C] mb-6 leading-relaxed font-medium">
              Schedule and conduct AI-powered meetings with your agents.
            </p>
            <Link href="/meetings" className="inline-flex items-center gap-x-1.5 text-sm font-extrabold hover:underline text-[#1F150C]">
              Explore <ChevronRightIcon className="size-4" />
            </Link>
          </div>

          {/* Feature 3: Smart Insights */}
          <div className={cardBase}>
            <div className="p-3 bg-[#E1DCC9] border-2 border-[#412D15] rounded-2xl w-fit shadow-[3px_3px_0px_0px_#412D15] mb-5">
              <SparklesIcon className="size-6 text-[#1F150C]" />
            </div>
            <h4 className="text-lg font-bold mb-2">Smart Insights</h4>
            <p className="text-sm text-[#6B5C4C] mb-6 leading-relaxed font-medium">
              Get intelligent insights and recommendations from your AI companions.
            </p>
            <Link href="/meetings" className="inline-flex items-center gap-x-1.5 text-sm font-extrabold hover:underline text-[#1F150C]">
              Explore <ChevronRightIcon className="size-4" />
            </Link>
          </div>

          {/* Feature 4: Lightning Fast */}
          <div className={cardBase}>
            <div className="p-3 bg-[#E1DCC9] border-2 border-[#412D15] rounded-2xl w-fit shadow-[3px_3px_0px_0px_#412D15] mb-5">
              <ZapIcon className="size-6 text-[#1F150C]" />
            </div>
            <h4 className="text-lg font-bold mb-2">Lightning Fast</h4>
            <p className="text-sm text-[#6B5C4C] mb-6 leading-relaxed font-medium">
              Experience blazing fast responses and real-time interactions.
            </p>
            <Link href="/meetings" className="inline-flex items-center gap-x-1.5 text-sm font-extrabold hover:underline text-[#1F150C]">
              Explore <ChevronRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-[#E1DCC9] border-[3px] border-[#412D15] shadow-[8px_8px_0px_0px_#412D15] rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-[4px_4px_0px_0px_#412D15] hover:-translate-y-1 hover:translate-x-[2px] transition-all duration-300">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-extrabold mb-3">
              Ready to get started?
            </h3>
            <p className="text-[#6B5C4C] font-semibold max-w-xl">
              Create your first AI agent or schedule a meeting to experience the power of Vanni.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/agents" className={btnPrimary}>
              <PlusIcon className="size-5" />
              Create Agent
            </Link>
            <Link href="/meetings" className={btnSecondary}>
              <VideoIcon className="size-5" />
              New Meeting
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
