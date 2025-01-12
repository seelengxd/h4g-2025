import { Link } from "react-router";
import { SIDEBAR_ITEMS } from "./sidebar-items";

const MobileSidebar = () => {
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
