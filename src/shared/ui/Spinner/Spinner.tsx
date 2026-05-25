import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export const Spinner = ({ size = 'md', centered = false }: SpinnerProps) => {
  const spinner = <div className={`${styles.spinner} ${styles[size]}`} />;

  if (centered) {
    return <div className={styles.center}>{spinner}</div>;
  }

  return spinner;
};
