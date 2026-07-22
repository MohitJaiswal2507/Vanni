import Link from "next/link";
import { ChevronRightIcon, TrashIcon, PencilIcon, MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  meetingId: string;
  meetingName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export const MeetingIdViewHeader = ({
  meetingId,
  meetingName,
  onEdit,
  onRemove
}: Props) => {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-[#412D15]/10 select-none">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-x-1">
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-extrabold text-2xl md:text-3xl text-[#1F150C]/50 hover:text-[#1F150C] transition-colors">
              <Link href="/meetings">
                My Meetings
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#412D15]/40 [&>svg]:size-5">
            <ChevronRightIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-extrabold text-2xl md:text-3xl text-[#1F150C] truncate max-w-[200px] md:max-w-[400px]">
              <Link href={`/meetings/${meetingId}`}>
                {meetingName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Without modal={false}, the dialog that this dropdown opens cause the website to get unclickable */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#E1DCC9] hover:bg-[#D8D1BE] border-2 border-[#412D15] text-[#1F150C] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] rounded-xl cursor-pointer size-9 p-0 flex items-center justify-center transition-all duration-150">
            <MoreVerticalIcon className="size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="bg-[#F8F5EF] border-2 border-[#412D15] shadow-[4px_4px_0px_0px_#412D15] rounded-xl p-1.5 text-[#1F150C] font-sans"
        >
          <DropdownMenuItem 
            onClick={onEdit}
            className="cursor-pointer flex items-center gap-x-2 font-bold p-2.5 rounded-lg hover:bg-[#D8D1BE] focus:bg-[#D8D1BE] text-sm text-[#1F150C] focus:text-[#1F150C] transition-all duration-150"
          >
            <PencilIcon className="size-4 text-[#1F150C]" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onRemove}
            className="cursor-pointer flex items-center gap-x-2 font-bold p-2.5 rounded-lg hover:bg-[#D8D1BE]/70 focus:bg-[#D8D1BE]/70 text-sm text-[#B54747] focus:text-[#B54747] transition-all duration-150"
          >
            <TrashIcon className="size-4 text-[#B54747]" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};