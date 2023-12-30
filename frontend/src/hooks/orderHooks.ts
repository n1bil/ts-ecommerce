import { useMutation, useQuery } from "@tanstack/react-query";
import { CartItem, ShippingAddress } from "../types/Cart";
import apiClient from "../apiClient";
import { Order } from "../types/Order";

type OrderRequest = {
    orderItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
};

type OrderResponseDto = {
    message: string;
    order: Order;
};

export const useGetOrderDetailsQuery = (id: string) => {
    return useQuery<Order>({
        queryKey: ['orders', id],
        queryFn: async () => {
            const response = await apiClient.get<Order>(`api/orders/${id}`);
            return response.data;
        },
    });
};

export const useCreateOrderMutation = () => useMutation({
    mutationFn: async (order: OrderRequest) => {
        const response = await apiClient.post<OrderResponseDto>("api/orders", order);
        return response.data;
    },
});

export const useGetPaypalClientIdQuery = () => {
    return useQuery({
        queryKey: ['paypal-clientId'],
        queryFn: async () => {
            const response = await apiClient.get<{ clientId: string }>('/api/keys/paypal');
            return response.data;
        },
    });
};

export const usePayOrderMutation = () => useMutation({
    mutationFn: async (details: { orderId: string }) => {
        const response = await apiClient.put<OrderResponseDto>(`api/orders/${details.orderId}/pay`, details);
        return response.data;
    },
});

export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () =>
      (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
  })