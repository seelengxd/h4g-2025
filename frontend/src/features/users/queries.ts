import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUserUsersPost,
  getAllUsersUsersGet,
  getUserUsersUserIdGet,
  Role,
  updateUserUsersUserIdPut,
} from "@/api";

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

export const getUser = (id: number) => {
  return queryOptions({
    queryKey: [UserQueryKeys.Users, id],
    queryFn: () =>
      getUserUsersUserIdGet({
        path: { user_id: id },
        withCredentials: true,
      }).then((response) => response.data),
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

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      full_name: string;
      username: string;
      role: Role;
      suspended: boolean;
      password?: string;
    }) => updateUserUsersUserIdPut({ path: { user_id: id }, body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKeys.Users] });
    },
  });
};
