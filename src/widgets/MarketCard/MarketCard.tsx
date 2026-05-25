import { useNavigate } from 'react-router-dom';

import { formatRelativeTime } from '@shared/lib/format';
import type { Market } from '@shared/types';
import { Badge, Card, marketStatusVariant } from '@shared/ui';

import styles from './MarketCard.module.css';

interface MarketCardProps {
  market: Market;
}

export const MarketCard = ({ market }: MarketCardProps) => {
  const navigate = useNavigate();

  return (
    <Card hoverable className={styles.card} onClick={() => navigate(`/markets/${market.id}`)}>
      <div className={styles.header}>
        <h3 className={styles.title}>{market.title}</h3>
        <Badge variant={marketStatusVariant[market.status] || 'default'}>
          {market.status}
        </Badge>
      </div>

      {market.description && (
        <p className={styles.description}>{market.description}</p>
      )}


      <div className={styles.footer}>
        <span className={styles.deadline}>
          ⏰ {formatRelativeTime(market.deadline)}
        </span>
        <div className={styles.outcomes}>
          {market.status === 'RESOLVED' && market.resolved_outcome ? (
            <Badge variant={market.resolved_outcome.toLowerCase() === 'yes' ? 'yes' : 'no'}>
              🏆 Победитель: {market.resolved_outcome}
            </Badge>
          ) : (
            market.outcomes.map((outcome) => (
              <Badge key={outcome} variant={outcome.toLowerCase() === 'yes' ? 'yes' : 'no'}>
                {outcome}
              </Badge>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
