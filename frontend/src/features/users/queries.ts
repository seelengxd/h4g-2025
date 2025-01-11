import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createUserUsersPost, getAllUsersUsersGet, Role } from "@/api";

export enum UserQueryKeys {
  Users = "users",
}

export const getUsers = () => {
  return queryOptions({
    queryKey: [UserQueryKeys.Users],
    queryFn: () =>
      getAllUsersUsersGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { full_name: string; username: string; role: Role }) =>
      createUserUsersPost({ body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKeys.Users] });
    },
  });
};
