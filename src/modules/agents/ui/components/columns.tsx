"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { GeneratedAvatar } from "@/components/generated-avatar"

import { AgentGetOne } from "../../types"

// Defines the columns for the agents table
export const columns: ColumnDef<AgentGetOne>[] = [
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

            className="size-6"
          />

          <span className="font-semibold capitalize">
            {row.original.name}
          </span>
        </div>

        {/* Short description/instructions */}
        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />

          {/* Truncate keeps long text in a single line */}
          <span className="text-sm text-muted-foreground max-w-50 truncate capitalize">
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
        className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        <VideoIcon className="text-blue-700" />

        {row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting" : "meetings"}

      </Badge>
    )
  }
]