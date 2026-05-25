import { create } from 'zustand';

import { positionsApi } from '@shared/api';
import type { Position, PositionsMeta } from '@shared/types';

interface PositionsState {
  positions: Position[];
  meta: PositionsMeta | null;
  isLoading: boolean;
  fetchPositions: () => Promise<void>;
  reset: () => void;
}

export const usePositionsStore = create<PositionsState>((set) => ({
  positions: [],
  meta: null,
  isLoading: false,

  fetchPositions: async () => {
    set({ isLoading: true });

    try {
      const { data } = await positionsApi.getPositions();

      set({ positions: data.data, meta: data.meta, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  reset: () => set({ positions: [], meta: null }),
}));
