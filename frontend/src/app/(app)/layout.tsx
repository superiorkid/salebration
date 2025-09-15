import { SidebarProvider } from "@/components/ui/sidebar";
import { getQueryClient } from "@/lib/query-client";
import { getSessionAction } from "@/servers/auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import AppNavBar from "./_components/app-navbar";
import { AppSidebar } from "./_components/app-sidebar";
import { companyKeys } from "@/lib/query-keys";
import { getCompany } from "@/servers/company";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = async ({ children }: AppLayoutProps) => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["session"],
      queryFn: async () => getSessionAction(),
    }),
    queryClient.prefetchQuery({
      queryKey: companyKeys.all,
      queryFn: async () => getCompany(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <AppNavBar />
          <div className="px-5 py-5 2xl:px-8">{children}</div>
        </main>
      </SidebarProvider>
    </HydrationBoundary>
  );
};

export default AppLayout;
