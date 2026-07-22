"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react"

import { cn, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"
import { GeneratedAvatar } from "@/components/generated-avatar"

import { MeetingGetMany } from "../../types"

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-[#C98928]/15 text-[#C98928] border-[#C98928]/35 shadow-[1px_1px_2px_rgba(201,137,40,0.06)]",
  active: "bg-[#1F150C]/10 text-[#1F150C] border-[#1F150C]/25 shadow-[1px_1px_2px_rgba(0,0,0,0.04)]",
  completed: "bg-[#3F7D58]/15 text-[#3F7D58] border-[#3F7D58]/35 shadow-[1px_1px_2px_rgba(63,125,88,0.06)]",
  cancelled: "bg-[#B54747]/15 text-[#B54747] border-[#B54747]/35 shadow-[1px_1px_2px_rgba(181,71,71,0.06)]",
  processing: "bg-[#C98928]/15 text-[#C98928] border-[#C98928]/35 shadow-[1px_1px_2px_rgba(201,137,40,0.06)]",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-bold text-base text-[#1F150C] capitalize">{row.original.name}</span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3 text-[#6B5C4C]" />
            <span className="text-sm text-[#6B5C4C] font-semibold max-w-50 truncate capitalize">
              {row.original.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-5 border border-[#412D15] rounded-full overflow-hidden shrink-0 bg-[#F8F5EF] shadow-[1px_1px_0px_0px_#412D15]"
          />
          <span className="text-sm text-[#6B5C4C] font-medium">
            {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
          </span>
        </div>
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 font-bold tracking-tight rounded-full px-2.5 py-0.5 border text-xs",
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          <Icon className={cn(row.original.status === "processing" && "animate-spin")} />
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "duration",
    header: "duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2 px-3 py-1 bg-[#F8F5EF] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] rounded-lg text-[#1F150C]/80 font-bold"
      >
        <ClockFadingIcon className="text-[#6B5C4C]" />
        {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
      </Badge>
    ),
  },
];