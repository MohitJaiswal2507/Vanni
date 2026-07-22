import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";

import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne;
};

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues
}: UpdateAgentDialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop: rgba(31,21,12,.18) with blur */}
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 duration-150 animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          style={{
            backgroundColor: "rgba(31, 21, 12, 0.18)",
            backdropFilter: "blur(4px)",
          }}
        />
        
        {/* Content Panel: Warm cream card, Coffee Brown border, large radius, block shadow */}
        <DialogPrimitive.Content 
          className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-[calc(100%-2rem)] sm:max-w-md bg-[#F5F1E8] border-[3.5px] border-[#412D15] shadow-[6px_6px_0px_0px_#412D15] rounded-[24px] p-8 outline-none duration-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 font-sans"
        >
          {/* Header */}
          <div className="flex flex-col gap-y-1 mb-6 select-none text-left">
            <DialogPrimitive.Title className="text-2xl font-extrabold text-[#1F150C] tracking-tight">
              Edit Agent
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm font-semibold text-[#6B5C4C]">
              Edit the agent details
            </DialogPrimitive.Description>
          </div>

          {/* Form */}
          <AgentForm
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
            initialValues={initialValues}
          />

          {/* Close button */}
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-full border-2 border-[#412D15] bg-[#F5F1E8] text-[#1F150C] shadow-[1.5px_1.5px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] cursor-pointer size-8 flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5 focus:outline-none">
            <XIcon className="size-4 shrink-0 text-[#1F150C]" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};