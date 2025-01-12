import {
  createOrderOrdersPost,
  getAllOrdersOrdersGet,
  getOrderOrdersOrderIdGet,
  OrderState,
  updateOrderOrdersOrderIdPatch,
} from "@/api";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthQueryKeys } from "../auth/queries";

export enum OrderQueryKeys {
  Orders = "orders",
}

export const getOrders = () => {
  return queryOptions({
    queryKey: [OrderQueryKeys.Orders],
    queryFn: () =>
      getAllOrdersOrdersGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};

export const getOrder = (id: number) => {
  return queryOptions({
    queryKey: [OrderQueryKeys.Orders, id],
    queryFn: () =>
      getOrderOrdersOrderIdGet({
        path: { order_id: id },
      }).then((response) => response.data),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { product_id: number; qty: number }[]) =>
      createOrderOrdersPost({
        body: { order_products: data },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OrderQueryKeys.Orders] });
    },
  });
};

export const useUpdateOrder = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { state: OrderState }) => {
      return updateOrderOrdersOrderIdPatch({
        path: { order_id: id },
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OrderQueryKeys.Orders, id] });
      queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.UserProfile] });
    },
  });
};
