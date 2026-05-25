import type { ReactNode } from 'react';

import styles from './Badge.module.css';

type BadgeVariant =
  | 'active' | 'closed' | 'resolved'
  | 'yes' | 'no'
  | 'pending' | 'filled' | 'cancelled'
  | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export const Badge = ({ variant = 'default', children, className = '' }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

/** Маппинг статуса рынка к варианту бейджа */
export const marketStatusVariant: Record<string, BadgeVariant> = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  RESOLVED: 'resolved',
};

/** Маппинг статуса ордера к варианту бейджа */
export const orderStatusVariant: Record<string, BadgeVariant> = {
  PENDING: 'pending',
  FILLED: 'filled',
  PARTIALLY_FILLED: 'active',
  CANCELLED: 'cancelled',
};
