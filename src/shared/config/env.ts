export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8081',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL as string || 'ws://localhost:8081',
  IS_DEV: import.meta.env.DEV,
} as const;
