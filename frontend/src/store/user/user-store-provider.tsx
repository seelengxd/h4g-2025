import { createContext, ReactNode, useContext, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";

import {
  defaultUserState,
  UserState,
  UserStore,
} from "@/store/user/user-store";
import { CartState, CartStore, defaultCartState } from "../cart/cart-store";
import { UserPublic } from "@/api";
import { OrderProductCreate } from "@/api";

export type CombinedStore = UserStore & CartStore;
export type CombinedStoreApi = StoreApi<CombinedStore>;
export const StoreContext = createContext<CombinedStoreApi | null>(null);

export const createCombinedStore = (
  initState: UserState & CartState = {
    ...defaultUserState,
    ...defaultCartState,
  }
) => {
  return createStore<CombinedStore>()((set) => ({
    ...initState,
    setUser: (user?: UserPublic) => set(() => ({ user, isLoading: false })),
    setCart: (cart?: OrderProductCreate[]) => set(() => ({ items: cart })),
  }));
};

export const CombinedStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<CombinedStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createCombinedStore();
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useCombinedStore = <T,>(
  selector: (store: CombinedStore) => T
): T => {
  const userStoreContext = useContext(StoreContext);

  if (!userStoreContext) {
    throw new Error(
      `useCombinedStore must be used within CombinedStoreProvider`
    );
  }
  return useStore(userStoreContext, selector);
};
