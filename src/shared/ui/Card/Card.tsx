import type { HTMLAttributes, ReactNode } from 'react';

import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  noPadding?: boolean;
  compact?: boolean;
}

export const Card = ({
  children,
  hoverable = false,
  noPadding = false,
  compact = false,
  onClick,
  className = '',
  ...props
}: CardProps) => {
  const classNames = [
    styles.card,
    hoverable ? styles.hoverable : '',
    onClick ? styles.clickable : '',
    noPadding ? styles.noPadding : '',
    compact ? styles.compact : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {children}
    </div>
  );
};
