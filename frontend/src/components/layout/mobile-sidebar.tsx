import { Link } from "react-router";
import { ADMIN_SIDEBAR_ITEMS, RESIDENT_SIDEBAR_ITEMS } from "./sidebar-items";
import { useCombinedStore } from "@/store/user/user-store-provider";

const MobileSidebar = () => {
  const { user } = useCombinedStore((store) => store);

  if (!user) {
    return;
  }

  const sidebarItems =
    user.role === "resident" ? RESIDENT_SIDEBAR_ITEMS : ADMIN_SIDEBAR_ITEMS;

  return (
    <div className="flex justify-around pt-2 mt-2 overflow-hidden border-t h-18">
      {sidebarItems.map(({ icon, label, path }) => (
        <Link to={path} key={path}>
          <div className="flex flex-col items-center">
            {<icon.type className="w-6 h-6" />}
            <span className="text-sm">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MobileSidebar;
