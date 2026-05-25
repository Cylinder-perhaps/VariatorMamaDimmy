import { create } from 'zustand';

import { tradesApi } from '@shared/api';
import type { PaginationMeta, Trade, TradesFilter } from '@shared/types';

interface TradesState {
  trades: Trade[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  fetchTrades: (filters?: TradesFilter) => Promise<void>;
  reset: () => void;
}

export const useTradesStore = create<TradesState>((set) => ({
  trades: [],
  meta: null,
  isLoading: false,

  fetchTrades: async (filters) => {
    set({ isLoading: true });

    try {
      const { data } = await tradesApi.getMyTrades(filters);

      set({ trades: data.data, meta: data.meta, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  reset: () => set({ trades: [], meta: null }),
}));
