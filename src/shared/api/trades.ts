import type { PaginatedResponse, Trade, TradesFilter } from '@shared/types';

import { api } from './instance';

export const tradesApi = {
  getMyTrades(filters?: TradesFilter) {
    return api.get<PaginatedResponse<Trade>>('/api/trades', { params: filters });
  },
};
