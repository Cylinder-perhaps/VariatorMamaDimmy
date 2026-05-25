import type { CreateOrderRequest, Order, OrdersFilter, PaginatedResponse } from '@shared/types';

import { api } from './instance';

export const ordersApi = {
  create(data: CreateOrderRequest) {
    return api.post<Order>('/api/orders', data);
  },

  cancel(orderId: string) {
    return api.delete(`/api/orders/${orderId}`);
  },

  getMyOrders(filters?: OrdersFilter) {
    return api.get<PaginatedResponse<Order>>('/api/orders', { params: filters });
  },
};
