import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        }
      }
    })
  }

  if (isPending || !data?.user) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="rounded-xl border-2 border-[#412D15] p-3 w-full flex items-center justify-between bg-[#F8F5EF] hover:bg-[#D8D1BE]/60 shadow-[3px_3px_0px_0px_#412D15] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#412D15] transition-all duration-300 focus:outline-none gap-x-2 select-none group cursor-pointer text-left">
          {data.user.image ? (
            <Avatar className="size-9 border-2 border-[#412D15] shadow-[1.5px_1.5px_0px_0px_#412D15] shrink-0">
              <AvatarImage src={data.user.image} />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.name}
              variant="initials"
              className="size-9 border-2 border-[#412D15] shadow-[1.5px_1.5px_0px_0px_#412D15] rounded-full overflow-hidden shrink-0"
            />
          )}
          <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1F150C] truncate w-full">
              {data.user.name}
            </p>
            <p className="text-xs font-semibold text-[#6B5C4C] truncate w-full">
              {data.user.email}
            </p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0 text-[#1F150C]/75 group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </DrawerTrigger>
        <DrawerContent className="bg-[#F8F5EF] border-t-2 border-[#412D15] text-[#1F150C] p-4 font-sans rounded-t-3xl">
          <DrawerHeader className="text-left mb-2">
            <DrawerTitle className="text-lg font-black text-[#1F150C]">{data.user.name}</DrawerTitle>
            <DrawerDescription className="text-sm font-semibold text-[#6B5C4C]">{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-col gap-y-3">
            <Button
              className="w-full bg-[#1F150C] hover:bg-[#322316] text-[#FFFFFF] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] rounded-xl py-2.5 font-bold flex items-center justify-center gap-x-2 transition-all duration-150 cursor-pointer"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="size-4" />
              Billing
            </Button>
            <Button
              className="w-full bg-[#F8F5EF] hover:bg-[#D8D1BE]/40 text-[#1F150C] border-2 border-[#412D15] shadow-[2px_2px_0px_0px_#412D15] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] rounded-xl py-2.5 font-bold flex items-center justify-center gap-x-2 transition-all duration-150 cursor-pointer"
              onClick={onLogout}
            >
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-xl border-2 border-[#412D15] p-3 w-full flex items-center justify-between bg-[#F8F5EF] hover:bg-[#D8D1BE]/60 shadow-[3px_3px_0px_0px_#412D15] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#412D15] transition-all duration-300 focus:outline-none gap-x-2 select-none group cursor-pointer">
       {data.user.image ? (
          <Avatar className="size-9 border-2 border-[#412D15] shadow-[1.5px_1.5px_0px_0px_#412D15] shrink-0">
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-9 border-2 border-[#412D15] shadow-[1.5px_1.5px_0px_0px_#412D15] rounded-full overflow-hidden shrink-0"
          />
        )}
        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1F150C] truncate w-full">
            {data.user.name}
          </p>
          <p className="text-xs font-semibold text-[#6B5C4C] truncate w-full">
            {data.user.email}
          </p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 text-[#1F150C]/75 group-data-[state=open]:rotate-180 transition-transform duration-200" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        side="right" 
        className="w-72 bg-[#F8F5EF] border-2 border-[#412D15] shadow-[5px_5px_0px_0px_#412D15] rounded-2xl p-2 text-[#1F150C] font-sans"
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-sm truncate">{data.user.name}</span>
            <span className="text-xs font-semibold text-[#6B5C4C] truncate">{data.user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#412D15]/20 my-1 h-[2px] mx-1" />
        <DropdownMenuItem
          onClick={() => authClient.customer.portal()}
          className="cursor-pointer flex items-center justify-between font-bold p-2.5 rounded-lg hover:bg-[#D8D1BE] focus:bg-[#D8D1BE] text-sm text-[#1F150C] focus:text-[#1F150C] transition-all duration-150"
        >
          Billing
          <CreditCardIcon className="size-4 text-[#1F150C]" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between font-bold p-2.5 rounded-lg hover:bg-[#D8D1BE] focus:bg-[#D8D1BE] text-sm text-[#1F150C] focus:text-[#1F150C] transition-all duration-150"
        >
          Logout
          <LogOutIcon className="size-4 text-[#1F150C]" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};