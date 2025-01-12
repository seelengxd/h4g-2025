import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { Toaster } from "@/components/ui/toaster";
import { getUserProfile } from "@/features/auth/queries";
import { useUserStore } from "@/store/user/user-store-provider";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "./app-sidebar";
import MobileSidebar from "./mobile-sidebar";

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
    <main className="relative flex flex-col w-screen h-screen p-2 overflow-y-scroll md:p-4">
      <Toaster />
      {!user && (
        <div className="w-full max-h-screen">
          <Outlet />
        </div>
      )}
      {user && (
        <>
          <div className="hidden w-full max-h-screen md:flex">
            <SidebarProvider>
              <AppSidebar pathname={pathname} />
              <main className="w-full p-4">
                <Outlet />
              </main>
            </SidebarProvider>
          </div>
          <div className="md:hidden">
            <div className="p-2 h-[calc(100vh-5rem)] overflow-y-scroll">
              <Outlet />
            </div>
            <MobileSidebar />
          </div>
        </>
      )}
    </main>
  );
};

export default Layout;
