import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { Toaster } from "@/components/ui/toaster";
import { getUserProfile } from "@/features/auth/queries";
import { useUserStore } from "@/store/user/user-store-provider";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "./app-sidebar";

const Layout: React.FC<PropsWithChildren> = () => {
  const { data: userProfile, isLoading } = useQuery(getUserProfile());

  const { user, setUser } = useUserStore((store) => store);
  const { pathname } = useLocation();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (userProfile) {
      setUser(userProfile);
    } else {
      setUser();
    }
  }, [setUser, userProfile, isLoading]);

  return (
    <main className="flex flex-col w-screen h-screen p-4 overflow-y-scroll">
      <Toaster />
      <div className="flex w-full max-h-screen">
        {user && (
          <SidebarProvider>
            <AppSidebar pathname={pathname} />
            <main className="w-full p-4">
              <Outlet />
            </main>
          </SidebarProvider>
        )}
        {!user && <Outlet />}
      </div>
    </main>
  );
};

export default Layout;
