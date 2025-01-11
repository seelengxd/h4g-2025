"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import qs from "qs";
import { ReactNode } from "react";

import { client } from "@/api";
import { UserStoreProvider } from "@/store/user/user-store-provider";

const queryClient = new QueryClient();

export function StoreProvider({ children }: { children: ReactNode }) {
  client.setConfig({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    paramsSerializer: (params) => {
      return qs.stringify(params, { indices: false });
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UserStoreProvider>{children}</UserStoreProvider>
    </QueryClientProvider>
  );
}
