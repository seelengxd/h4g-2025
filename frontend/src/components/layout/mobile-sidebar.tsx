import { Link, useNavigate } from "react-router";
import { SIDEBAR_ITEMS } from "./sidebar-items";
import { logoutAuthLogoutGet } from "@/api";
import { useUserStore } from "@/store/user/user-store-provider";

const MobileSidebar = () => {
  const { user, setUser } = useUserStore((store) => store);
  const navigate = useNavigate();

  if (!user) {
    return;
  }

  //   todo: figure out where to use this
  const signout = async () => {
    await logoutAuthLogoutGet({ withCredentials: true });
    setUser();
    navigate("/login");
  };

  return (
    <div className="flex justify-around pt-2 mt-2 overflow-hidden border-t h-18">
      {SIDEBAR_ITEMS.map(({ icon, label, path }) => (
        <Link to={path}>
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
