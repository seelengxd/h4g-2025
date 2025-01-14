import { useCombinedStore } from "@/store/user/user-store-provider";
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router";

const AuthenticatedPage: React.FC = () => {
  const { user, isLoading } = useCombinedStore((store) => store);
  if (isLoading) {
    return <Loader className="animate-spin" />;
  }
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AuthenticatedPage;
