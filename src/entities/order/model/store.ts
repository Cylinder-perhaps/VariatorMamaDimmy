import { create } from 'zustand';

import { ordersApi } from '@shared/api';
import type { CreateOrderRequest, Order, OrdersFilter, PaginationMeta } from '@shared/types';

interface OrdersState {
  orders: Order[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;

  fetchMyOrders: (filters?: OrdersFilter) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  reset: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  meta: null,
  isLoading: false,
  isCreating: false,
  error: null,

  fetchMyOrders: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await ordersApi.getMyOrders(filters);

      set({ orders: data.data, meta: data.meta, isLoading: false });
    } catch {
      set({ error: 'Не удалось загрузить ордера', isLoading: false });
    }
  },

  createOrder: async (orderData) => {
    set({ isCreating: true, error: null });

    try {
      const { data } = await ordersApi.create(orderData);
      const currentOrders = get().orders;

      set({ orders: [data, ...currentOrders], isCreating: false });

      return data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Ошибка создания ордера';

      set({ error: message, isCreating: false });

      throw err;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      await ordersApi.cancel(orderId);
      const currentOrders = get().orders;

      set({
        orders: currentOrders.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o)),
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Ошибка отмены ордера';

      set({ error: message });

      throw err;
    }
  },

  reset: () => set({ orders: [], meta: null }),
}));
