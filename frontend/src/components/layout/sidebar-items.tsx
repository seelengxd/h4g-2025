import { ShoppingBag } from "lucide-react";
import {
  GoDatabase,
  GoGraph,
  GoHome,
  GoListUnordered,
  GoPeople,
} from "react-icons/go";

export const ADMIN_SIDEBAR_ITEMS = [
  { path: "/users", icon: <GoPeople />, label: "Users" },
  { path: "/products", icon: <GoDatabase />, label: "Shop" },
  { path: "/reports", icon: <GoGraph />, label: "Reports" },
  { path: "/settings", icon: <GoListUnordered />, label: "Settings" },
];

export const RESIDENT_SIDEBAR_ITEMS = [
  { path: "/home", icon: <GoHome />, label: "Home" },
  { path: "/products", icon: <ShoppingBag />, label: "Shop" },
];
