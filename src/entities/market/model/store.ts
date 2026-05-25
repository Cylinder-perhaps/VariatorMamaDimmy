import { create } from 'zustand';

import { marketsApi } from '@shared/api';
import type { Market, MarketsFilter, PaginationMeta } from '@shared/types';

interface MarketsState {
  markets: Market[];
  currentMarket: Market | null;
  meta: PaginationMeta | null;
  filters: MarketsFilter;
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;

  fetchMarkets: (filters?: MarketsFilter) => Promise<void>;
  fetchMarketById: (id: string) => Promise<void>;
  setFilters: (filters: Partial<MarketsFilter>) => void;
  reset: () => void;
}

export const useMarketsStore = create<MarketsState>((set, get) => ({
  markets: [],
  currentMarket: null,
  meta: null,
  filters: { page: 1, per_page: 12, sort_by: 'created_at' },
  isLoading: false,
  isLoadingDetails: false,
  error: null,

  fetchMarkets: async (overrideFilters) => {
    set({ isLoading: true, error: null });

    try {
      const filters = overrideFilters || get().filters;
      const { data } = await marketsApi.list(filters);

      set({ markets: data.data, meta: data.meta, isLoading: false });
    } catch {
      set({ error: 'Не удалось загрузить рынки', isLoading: false });
    }
  },

  fetchMarketById: async (id) => {
    set({ isLoadingDetails: true, error: null });

    try {
      const { data } = await marketsApi.getById(id);

      set({ currentMarket: data, isLoadingDetails: false });
    } catch {
      set({ error: 'Рынок не найден', isLoadingDetails: false });
    }
  },

  setFilters: (newFilters) => {
    const current = get().filters;

    set({ filters: { ...current, ...newFilters } });
  },

  reset: () => set({ markets: [], currentMarket: null, meta: null }),
}));
