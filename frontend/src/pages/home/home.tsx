import { useCombinedStore } from "@/store/user/user-store-provider";
import UserHome from "./user-home";
import StaffHome from "./staff-home";

const Home = () => {
  const user = useCombinedStore((store) => store.user);
  if (!user) {
    return;
  }
  if (user.role === "resident") {
    return <UserHome />;
  }
  return <StaffHome />;
};

export default Home;
