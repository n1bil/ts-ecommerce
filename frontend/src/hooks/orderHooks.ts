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

type OrderArgument = {
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
        const response = await apiClient.post<OrderArgument>("api/orders", order);
        return response.data;
    },
});
