import type { CreateMarketRequest, Market, ResolveMarketRequest, ResolveMarketResponse } from '@shared/types';

import { api } from './instance';

export const adminApi = {
  resolveMarket(marketId: string, data: ResolveMarketRequest) {
    return api.post<ResolveMarketResponse>(`/api/admin/markets/${marketId}/resolve`, data);
  },

  createMarket(data: CreateMarketRequest) {
    return api.post<Market>('/api/admin/markets', data);
  },
};
