import { ChevronUp, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { logoutAuthLogoutGet } from "@/api";
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useUserStore } from "@/store/user/user-store-provider";
import { Badge } from "../ui/badge";
import { SIDEBAR_ITEMS } from "./sidebar-items";

type OwnProps = {
  pathname: string;
};

const AppSidebar: React.FC<OwnProps> = ({ pathname }) => {
  const { user, setUser } = useUserStore((store) => store);
  const navigate = useNavigate();

  if (!user) {
    return;
  }

  const signout = async () => {
    await logoutAuthLogoutGet({ withCredentials: true });
    setUser();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-center w-full gap-2 text-lg">
                  <img src="logo.png" className="w-8 h-8" />
                  MWH Minimart
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarMenu>
            {SIDEBAR_ITEMS.map(({ icon, label, path }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild isActive={pathname === path}>
                  <Link to={path}>
                    {icon}
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user.full_name}{" "}
                  <Badge className="bg-blue-200 rounded-md">{user.role}</Badge>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={signout} className="cursor-pointer">
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
