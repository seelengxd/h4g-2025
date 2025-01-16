import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUserUsersPost,
  getAllTasksVoucherTaskGet,
  getAllUsersUsersGet,
  getTaskVoucherTaskTaskIdGet,
  getUserUsersUserIdGet,
  Role,
  updateUserUsersUserIdPut,
} from "@/api";

export enum VoucherQueryKeys {
  VoucherTask = "voucher-tasks",
}

export const getVoucherTasks = () => {
  return queryOptions({
    queryKey: [VoucherQueryKeys.VoucherTask],
    queryFn: () =>
      getAllTasksVoucherTaskGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};

export const getVoucherTask = (id: number) => {
  return queryOptions({
    queryKey: [VoucherQueryKeys.VoucherTask, id],
    queryFn: () =>
      getTaskVoucherTaskTaskIdGet({
        path: { task_id: id },
        withCredentials: true,
      }).then((response) => response.data),
  });
};
