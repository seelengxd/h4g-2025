import { MiniProductPublic } from "@/api";

export interface OrderProduct {
  product: MiniProductPublic;
  qty: number;
}

export interface CartState {
  items: OrderProduct[];
}

export const defaultCartState: CartState = { items: [] };

interface CartActions {
  setCart: (items: OrderProduct[]) => void;
}

export type CartStore = CartState & CartActions;
