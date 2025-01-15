import {
  completeAuctionAuctionsAuctionIdPut,
  createAuctionAuctionsPost,
  getAllAuctionsAuctionsGet,
  getAuctionAuctionsAuctionIdGet,
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
      getAuctionAuctionsAuctionIdGet({ path: { auction_id: id } }).then(
        (response) => response.data
      ),
    refetchInterval: 2000,
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

export const useCloseAuction = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return completeAuctionAuctionsAuctionIdPut({
        path: { auction_id: id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AuctionQueryKeys.Auctions, id],
      });
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
