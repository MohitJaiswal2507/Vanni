"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { GeneratedAvatar } from "@/components/generated-avatar"

import { AgentsGetMany } from "../../types"

// Defines the columns for the agents table
export const columns: ColumnDef<AgentsGetMany[number]>[] = [
  {
    // Uses the "name" field for this column
    accessorKey: "name",

    // Column heading
    header: "Agent Name",

    // Custom UI for each cell
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">

        {/* Avatar and agent name */}
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            variant="botttsNeutral"

            // Generates the same avatar for the same name
            seed={row.original.name}

            className="size-6 border border-[#412D15] rounded-full overflow-hidden shrink-0 bg-[#F8F5EF] shadow-[1px_1px_0px_0px_#412D15]"
          />

          <span className="font-bold text-[#1F150C] capitalize">
            {row.original.name}
          </span>
        </div>

        {/* Short description/instructions */}
        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-[#6B5C4C]" />

          {/* Truncate keeps long text in a single line */}
          <span className="text-sm text-[#6B5C4C] max-w-50 truncate capitalize font-semibold">
            {row.original.instructions}
          </span>
        </div>

      </div>
    )
  },
  {
    // Column for meeting count
    accessorKey: "meetingCount",

    header: "Meetings",

    // Displays meeting count inside a badge
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4 px-3 py-1 bg-[#F8F5EF] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] rounded-lg text-[#1F150C]/80 font-bold"
      >
        <VideoIcon className="text-[#6B5C4C]" />

        {row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting" : "meetings"}

      </Badge>
    )
  }
]