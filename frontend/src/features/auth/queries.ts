import { queryOptions } from "@tanstack/react-query";

import { getUserAuthSessionGet } from "@/api";

export enum AuthQueryKeys {
  UserProfile = "user_profile",
}

export const getUserProfile = () => {
  return queryOptions({
    queryKey: [AuthQueryKeys.UserProfile],
    queryFn: () =>
      getUserAuthSessionGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};
