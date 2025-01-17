import {
  Category,
  createProductProductsPost,
  getAllProductsProductsGet,
  getProductProductsProductIdGet,
  updateProductProductsProductIdPut,
} from "@/api";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export enum ProductQueryKeys {
  Products = "products",
}

export const getProducts = () => {
  return queryOptions({
    queryKey: [ProductQueryKeys.Products],
    queryFn: () =>
      getAllProductsProductsGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};

export const getProduct = (id: number) => {
  return queryOptions({
    queryKey: [ProductQueryKeys.Products, id],
    queryFn: () =>
      getProductProductsProductIdGet({
        path: { product_id: id },
        withCredentials: true,
      }).then((response) => response.data),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      image?: string | null;
      points: number;
      total_qty: number;
      category: Category;
    }) => createProductProductsPost({ body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProductQueryKeys.Products] });
    },
  });
};

export const useUpdateProduct = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      image?: string | null;
      points: number;
      total_qty: number;
      category: Category;
    }) =>
      updateProductProductsProductIdPut({
        path: { product_id: id },
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProductQueryKeys.Products] });
    },
  });
};
