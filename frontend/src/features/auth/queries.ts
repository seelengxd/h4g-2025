import { queryOptions } from "@tanstack/react-query";

import { getUserAuthSessionGet } from "@/api";

export enum UserQueryKeys {
  UserProfile = "user_profile",
}

export const getUserProfile = () => {
  return queryOptions({
    queryKey: [UserQueryKeys.UserProfile],
    queryFn: () =>
      getUserAuthSessionGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};
