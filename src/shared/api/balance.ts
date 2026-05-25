import type { Balance } from '@shared/types';

import { api } from './instance';

export const balanceApi = {
  getBalance() {
    return api.get<Balance>('/api/balance');
  },
};
