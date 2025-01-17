import {
  ChartSpline,
  Database,
  HammerIcon,
  Home,
  ShoppingBag,
  Ticket,
  UsersRound,
} from "lucide-react";

export const ADMIN_SIDEBAR_ITEMS = [
  { path: "/", icon: <Home />, label: "Home" },
  { path: "/users", icon: <UsersRound />, label: "Users" },
  { path: "/products", icon: <Database />, label: "Inventory" },
  { path: "/vouchers", icon: <Ticket />, label: "Vouchers" },
  { path: "/auctions", icon: <HammerIcon />, label: "Auctions" },
  { path: "/reports", icon: <ChartSpline />, label: "Reports" },
];

export const RESIDENT_SIDEBAR_ITEMS = [
  { path: "/", icon: <Home />, label: "Home" },
  { path: "/products", icon: <ShoppingBag />, label: "Shop" },
  { path: "/vouchers", icon: <Ticket />, label: "Vouchers" },
  { path: "/auctions", icon: <HammerIcon />, label: "Auctions" },
];
