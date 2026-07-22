import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AgentGetOne } from "../../types";
import { agentsInsertSchema } from "../../schemas";
import { useRouter } from "next/navigation";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions(),
        );

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    }),
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({ ...values, id: initialValues.id });
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form 
        className={isEdit ? "space-y-5 select-none text-left" : "space-y-4"} 
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isEdit ? (
          <div className="flex justify-start mb-1">
            <GeneratedAvatar
              seed={form.watch("name")}
              variant="botttsNeutral"
              className="size-16 border-2 border-[#412D15] rounded-full overflow-hidden bg-[#F5F1E8] shadow-[2px_2px_0px_0px_#412D15] hover:scale-105 transition-transform duration-200"
            />
          </div>
        ) : (
          <GeneratedAvatar
            seed={form.watch("name")}
            variant="botttsNeutral"
            className="border size-16"
          />
        )}
        
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className={isEdit ? "flex flex-col gap-y-1.5" : ""}>
              <FormLabel className={isEdit ? "font-extrabold text-sm text-[#1F150C] tracking-tight mb-0.5" : ""}>
                Name
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g. Math tutor" 
                  className={isEdit ? "h-10 bg-[#F5F1E8] border-2 border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/30 focus-visible:border-[#412D15] transition-all duration-200 w-full px-3" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem className={isEdit ? "flex flex-col gap-y-1.5" : ""}>
              <FormLabel className={isEdit ? "font-extrabold text-sm text-[#1F150C] tracking-tight mb-0.5" : ""}>
                Instructions
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful math assistant that can answer questions and help with assignments."
                  className={isEdit ? "bg-[#F5F1E8] border-2 border-[#412D15] rounded-xl text-[#1F150C] placeholder:text-[#6B5C4C]/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#412D15]/30 focus-visible:border-[#412D15] transition-all duration-200 w-full px-3 py-2 min-h-[120px] resize-none" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className={isEdit ? "flex justify-end gap-x-3 pt-3" : "flex justify-between gap-x-2"}>
          {onCancel && (
            <Button
              variant={isEdit ? "default" : "ghost"}
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
              className={isEdit ? "bg-[#F5F1E8] hover:bg-[#D8D1BE] text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150 cursor-pointer h-10" : ""}
            >
              Cancel
            </Button>
          )}
          <Button 
            disabled={isPending} 
            type="submit"
            className={isEdit ? "bg-[#412D15] hover:bg-[#523d24] text-[#F5F1E8] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150 cursor-pointer h-10" : ""}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};