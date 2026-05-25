import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'title' | 'circle' | 'rect';
  className?: string;
}

export const Skeleton = ({ width, height, variant = 'rect', className = '' }: SkeletonProps) => {
  const variantClass = variant !== 'rect' ? styles[variant] : '';

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
};
