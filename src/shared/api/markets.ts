import type { Market, MarketsFilter, PaginatedResponse } from '@shared/types';

import { api } from './instance';

export const marketsApi = {
  list(filters?: MarketsFilter) {
    return api.get<PaginatedResponse<Market>>('/api/markets', { params: filters });
  },

  getById(id: string) {
    return api.get<Market>(`/api/markets/${id}`);
  },
};
