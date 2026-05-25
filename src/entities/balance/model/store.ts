import { create } from 'zustand';

import { balanceApi } from '@shared/api';
import type { Balance } from '@shared/types';

interface BalanceState {
  balance: Balance | null;
  isLoading: boolean;
  fetchBalance: () => Promise<void>;
  reset: () => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  isLoading: false,

  fetchBalance: async () => {
    set({ isLoading: true });

    try {
      const { data } = await balanceApi.getBalance();

      set({ balance: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  reset: () => set({ balance: null }),
}));
