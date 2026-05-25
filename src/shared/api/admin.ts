import type { 
  CreateMarketRequest, 
  Market, 
  ResolveMarketRequest, 
  ResolveMarketResponse,
  UsersResponse,
  UpdateUserRoleRequest
} from '@shared/types';

import { api } from './instance';

export const adminApi = {
  resolveMarket(marketId: string, data: ResolveMarketRequest) {
    return api.post<ResolveMarketResponse>(`/api/admin/markets/${marketId}/resolve`, data);
  },

  createMarket(data: CreateMarketRequest) {
    return api.post<Market>('/api/admin/markets', data);
  },

  listUsers(params?: { page?: number; per_page?: number }) {
    return api.get<UsersResponse>('/api/admin/users', { params });
  },

  updateUserRole(userId: string, data: UpdateUserRoleRequest) {
    return api.patch<void>(`/api/admin/users/${userId}/role`, data);
  },
};
