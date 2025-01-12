import { ShoppingBag } from "lucide-react";
import { GoDatabase, GoGraph, GoHome, GoPeople } from "react-icons/go";

export const ADMIN_SIDEBAR_ITEMS = [
  { path: "/", icon: <GoHome />, label: "Home" },
  { path: "/users", icon: <GoPeople />, label: "Users" },
  { path: "/products", icon: <GoDatabase />, label: "Inventory" },
  { path: "/reports", icon: <GoGraph />, label: "Reports" },
];

export const RESIDENT_SIDEBAR_ITEMS = [
  { path: "/", icon: <GoHome />, label: "Home" },
  { path: "/products", icon: <ShoppingBag />, label: "Shop" },
];
