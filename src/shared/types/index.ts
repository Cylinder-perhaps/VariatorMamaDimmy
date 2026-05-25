// ===== Auth =====

export interface User {
  id: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

// ===== Markets =====

export type MarketStatus = 'ACTIVE' | 'CLOSED' | 'RESOLVED';

export interface Market {
  id: string;
  title: string;
  description: string | null;
  outcomes: string[];
  status: MarketStatus;
  deadline: string;
  resolved_outcome: string | null;
  created_at: string;
  created_by: string;
}

export interface CreateMarketRequest {
  title: string;
  description?: string | null;
  outcomes: string[];
  deadline: string;
  category?: string | null;
}

// ===== Orders =====

export type OrderStatus = 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED';

export interface Order {
  id: string;
  market_id: string;
  outcome: string;
  quantity: number;
  price: number;
  amount_paid: number;
  status: OrderStatus;
  created_at: string;
}

export interface CreateOrderRequest {
  market_id: string;
  outcome: string;
  quantity: number;
}

// ===== Positions =====

export interface Position {
  market_id: string;
  market_title: string;
  outcome: string;
  quantity: number;
  avg_cost: number;
  current_value: number;
  pnl: number;
}

export interface PositionsMeta {
  total_positions: number;
  total_invested: number;
  total_current_value: number;
  total_pnl: number;
}

export interface PositionsResponse {
  data: Position[];
  meta: PositionsMeta;
}

// ===== Balance =====

export interface Balance {
  total: number;
  available: number;
  blocked_in_orders: number;
}

// ===== Trades =====

export interface Trade {
  id: string;
  market_id: string;
  market_title: string;
  outcome: string;
  quantity: number;
  price: number;
  pnl: number;
  executed_at: string;
}

// ===== Pagination =====

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ===== Errors =====

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | null;
  };
}

// ===== Resolve Market =====

export interface ResolveMarketRequest {
  winning_outcome: string;
  evidence_url?: string | null;
}

export interface ResolveMarketResponse {
  market_id: string;
  status: 'RESOLVED';
  winning_outcome: string;
  total_payout: number;
  resolved_at: string;
}

// ===== Filters =====

export interface MarketsFilter {
  page?: number;
  per_page?: number;
  status?: MarketStatus;
  sort_by?: 'created_at' | 'deadline' | 'liquidity';
}

export interface OrdersFilter {
  page?: number;
  per_page?: number;
  status?: OrderStatus;
}

export interface TradesFilter {
  page?: number;
  per_page?: number;
  market_id?: string;
}
