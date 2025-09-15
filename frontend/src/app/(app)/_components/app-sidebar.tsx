"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useSession, useSignOut } from "@/hooks/tanstack/auth";
import { useDetailCompany } from "@/hooks/tanstack/company";
import { useSidebarMenus } from "@/hooks/use-sidebar-menus";
import { cn } from "@/lib/utils";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SquareUserIcon,
  User2,
} from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  const { session, isPending: sessionPending } = useSession();
  const { logoutMutation, isPending: logoutPending } = useSignOut();
  const { filteredGroup, isPending } = useSidebarMenus();

  const { company, isPending: companyPending } = useDetailCompany();

  return (
    <Sidebar className="z-50" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className={cn(
                buttonVariants({
                  className: cn(
                    "w-full text-base font-semibold capitalize",
                    companyPending && "cursor-not-allowed",
                  ),
                  variant: "ghost",
                }),
              )}
            >
              {companyPending ? "Loading..." : company?.data?.display_name}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="[scrollbar-color:--alpha(var(--foreground)/20%)_transparent] [scrollbar-width:thin]">
        {isPending ? (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          filteredGroup.map((group) => (
            <SidebarGroup key={group.groupName || "main"}>
              {group.groupName && (
                <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton disabled={sessionPending}>
                  {sessionPending ? (
                    <>
                      <User2 className="h-4 w-4" /> Loading...
                    </>
                  ) : (
                    <>
                      <User2 className="h-4 w-4" />
                      <span className="truncate capitalize">
                        {session?.data?.name}
                      </span>
                      <ChevronsUpDownIcon className="ml-auto h-4 w-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="ml-2 w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem disabled={logoutPending}>
                  <SquareUserIcon className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={logoutPending}
                  onClick={() => logoutMutation()}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>{logoutPending ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
