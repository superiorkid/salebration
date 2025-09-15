"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/tanstack/auth";

const AppNavBar = () => {
  const { session, isPending } = useSession();

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b bg-[#FCFCFC] py-2 pr-6 pl-2.5">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        {isPending ? (
          "Loading..."
        ) : (
          <span className="hidden lg:flex">
            Welcome back,{" "}
            <span className="font-semibold capitalize">
              {session?.data?.name}
            </span>
          </span>
        )}
      </div>
      {/* <div className="flex items-center gap-4">
        <SearchInput />
        <Button
          variant="outline"
          size="icon"
          className="relative h-8"
          aria-label="Notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {1 > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {1 > 99 ? "99+" : 1}
            </Badge>
          )}
        </Button>
      </div> */}
    </nav>
  );
};

export default AppNavBar;
