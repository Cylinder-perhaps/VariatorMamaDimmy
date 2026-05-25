import type { AuthResponse, LoginRequest, RefreshTokenResponse, RegisterRequest } from '@shared/types';

import { api } from './instance';

export const authApi = {
  register(data: RegisterRequest) {
    return api.post<AuthResponse>('/api/auth/register', data);
  },

  login(data: LoginRequest) {
    return api.post<AuthResponse>('/api/auth/login', data);
  },

  refresh(refresh_token: string) {
    return api.post<RefreshTokenResponse>('/api/auth/refresh', { refresh_token });
  },

  logout() {
    return api.post('/api/auth/logout');
  },
};
