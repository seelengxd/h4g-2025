import { GoDatabase, GoGraph, GoListUnordered, GoPeople } from "react-icons/go";

export const SIDEBAR_ITEMS = [
  { path: "/users", icon: <GoPeople />, label: "Users" },
  { path: "/products", icon: <GoDatabase />, label: "Shop" },
  { path: "/reports", icon: <GoGraph />, label: "Reports" },
  { path: "/settings", icon: <GoListUnordered />, label: "Settings" },
];
