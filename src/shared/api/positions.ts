import type { PositionsResponse } from '@shared/types';

import { api } from './instance';

export const positionsApi = {
  getPositions() {
    return api.get<PositionsResponse>('/api/positions');
  },
};
