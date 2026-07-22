"use client";

import { toast } from "sonner";
import { useState } from "react";

import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { UpdateAgentDialog } from "../components/update-agent-dialog";
import { AgentIdViewHeader } from "../components/agent-id-view-header";

interface Props {
  agentId: string;
};

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  
  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions(),
        );
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meetings`,
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />
        <div className="bg-[#F8F5EF] border-2 border-[#412D15] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),6px_6px_0px_0px_#412D15] rounded-[24px] hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_#412D15] transition-all duration-300 overflow-hidden">
          <div className="px-6 py-6 gap-y-5 flex flex-col">
            <div className="flex items-center gap-x-3.5 select-none">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-11 border-2 border-[#412D15] rounded-full overflow-hidden bg-[#F8F5EF] shadow-[2px_2px_0px_0px_#412D15] hover:scale-105 transition-transform duration-200 shrink-0"
              />
              <h2 className="text-3xl font-extrabold text-[#1F150C] capitalize leading-none tracking-tight">{data.name}</h2>
            </div>
            
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4 px-3 py-1.5 bg-[#E1DCC9] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] rounded-lg text-[#1F150C] font-bold w-fit hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition-all duration-150 cursor-pointer select-none"
            >
              <VideoIcon className="text-[#6B5C4C]" />
              {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>
            
            <div className="flex flex-col gap-y-3 mt-2">
              <p className="text-lg font-extrabold text-[#1F150C] tracking-tight select-none">Instructions</p>
              <div className="bg-[#F5F1E8] border-2 border-[#412D15]/15 rounded-xl p-5 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.03)] text-base text-[#1F150C]/90 font-medium leading-relaxed select-text whitespace-pre-wrap">
                {data.instructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds"
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agent"
      description="Something went wrong"
    />
  )
}