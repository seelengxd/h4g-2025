import { createStore } from "zustand";

import { UserPublic } from "@/api";

interface UserState {
  user?: UserPublic;
  isLoading: boolean;
}

export const defaultUserState: UserState = { isLoading: true };

interface UserActions {
  setUser: (user?: UserPublic) => void;
}

export type UserStore = UserState & UserActions;

export const createUserStore = (initState: UserState = defaultUserState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUser: (user?: UserPublic) => set(() => ({ user, isLoading: false })),
  }));
};
