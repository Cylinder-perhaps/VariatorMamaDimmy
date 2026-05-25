import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  yesPercent: number;
  showLabels?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
}

export const ProgressBar = ({
  yesPercent,
  showLabels = true,
  size = 'sm',
  className = '',
}: ProgressBarProps) => {
  const clampedYes = Math.max(0, Math.min(100, yesPercent));
  const noPercent = 100 - clampedYes;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {showLabels && (
        <div className={styles.labels}>
          <span className={styles.yesLabel}>Да {clampedYes}%</span>
          <span className={styles.noLabel}>Нет {noPercent}%</span>
        </div>
      )}
      <div className={`${styles.track} ${size === 'lg' ? styles.trackLg : ''}`}>
        <div className={styles.fill} style={{ width: `${clampedYes}%` }} />
      </div>
    </div>
  );
};
