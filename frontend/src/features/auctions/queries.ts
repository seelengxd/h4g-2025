import {
  createAuctionAuctionsPost,
  getAllAuctionsAuctionsGet,
  makeBidAuctionsAuctionIdBidsPost,
} from "@/api";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export enum AuctionQueryKeys {
  Auctions = "auctions",
}

export const getAuctions = () => {
  return queryOptions({
    queryKey: [AuctionQueryKeys.Auctions],
    queryFn: () =>
      getAllAuctionsAuctionsGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};

export const getAuction = (id: number) => {
  return queryOptions({
    queryKey: [AuctionQueryKeys.Auctions, id],
    queryFn: () =>
      getAllAuctionsAuctionsGet({ withCredentials: true }).then(
        (response) => response.data
      ),
  });
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      product_id: number;
      reserve_price: number;
      end_time: Date;
    }) => createAuctionAuctionsPost({ body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AuctionQueryKeys.Auctions] });
    },
  });
};

export const useCreateBid = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { bid: number }) => {
      return makeBidAuctionsAuctionIdBidsPost({
        path: { auction_id: id },
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AuctionQueryKeys.Auctions, id],
      });
    },
  });
};
