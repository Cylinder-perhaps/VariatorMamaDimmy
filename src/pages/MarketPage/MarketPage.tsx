import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMarketsStore } from '@entities/market/model/store';
import { useOrdersStore } from '@entities/order/model/store';
import { useAuthStore } from '@entities/user/model/store';
import { formatCurrency, formatDate, formatRelativeTime } from '@shared/lib/format';
import { Badge, Button, Card, Input, ProgressBar, Spinner, marketStatusVariant, toast } from '@shared/ui';

import styles from './MarketPage.module.css';

export const MarketPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentMarket, isLoadingDetails, fetchMarketById } = useMarketsStore();
  const { createOrder, isCreating } = useOrdersStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('10');

  useEffect(() => {
    if (id) {
      void fetchMarketById(id);
    }
  }, [id, fetchMarketById]);

  useEffect(() => {
    if (currentMarket?.outcomes?.[0] && !selectedOutcome) {
      setSelectedOutcome(currentMarket.outcomes[0]);
    }
  }, [currentMarket, selectedOutcome]);

  if (isLoadingDetails) {
    return <Spinner centered size="lg" />;
  }

  if (!currentMarket) {
    return (
      <div className={styles.page}>
        <p>Рынок не найден</p>
      </div>
    );
  }

  const hashCode = currentMarket.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const yesPercent = (hashCode % 80) + 10;
  const noPercent = 100 - yesPercent;
  const price = selectedOutcome.toLowerCase() === 'yes' ? yesPercent / 100 : noPercent / 100;
  const qty = parseInt(quantity) || 0;
  const cost = qty * price;
  const potentialProfit = qty * (1 - price);

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/auth');

      return;
    }

    if (!id || qty <= 0) {
      return;
    }

    try {
      await createOrder({
        market_id: id,
        outcome: selectedOutcome,
        quantity: qty,
      });
      toast.success(`Ордер на ${qty} акций «${selectedOutcome}» создан!`);
      setQuantity('10');
    } catch {
      toast.error('Не удалось создать ордер');
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>
        ← Все рынки
      </button>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{currentMarket.title}</h1>
          <Badge variant={marketStatusVariant[currentMarket.status] || 'default'}>
            {currentMarket.status}
          </Badge>
        </div>
        {currentMarket.description && (
          <p className={styles.desc}>{currentMarket.description}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.metaItem}>📅 Создан {formatDate(currentMarket.created_at)}</span>
          <span className={styles.metaItem}>⏰ Дедлайн: {formatRelativeTime(currentMarket.deadline)}</span>
        </div>
      </div>

      <div className={styles.content}>
        {/* Left: Probability + Details */}
        <div>
          <div className={styles.probSection}>
            <h2 className={styles.probTitle}>Вероятность</h2>
            <div className={styles.probCards}>
              <Card compact>
                <div className={styles.probCard}>
                  <div className={`${styles.probPercent} ${styles.probYes}`}>{yesPercent}%</div>
                  <div className={styles.probLabel}>Да</div>
                </div>
              </Card>
              <Card compact>
                <div className={styles.probCard}>
                  <div className={`${styles.probPercent} ${styles.probNo}`}>{noPercent}%</div>
                  <div className={styles.probLabel}>Нет</div>
                </div>
              </Card>
            </div>
            <ProgressBar yesPercent={yesPercent} size="lg" />
          </div>
        </div>

        {/* Right: Trade Panel */}
        <Card className={styles.tradeCard}>
          <h3 className={styles.tradeTitle}>Торговля</h3>

          <div className={styles.outcomeButtons}>
            {currentMarket.outcomes.map((outcome) => (
              <Button
                key={outcome}
                variant={selectedOutcome === outcome ? (outcome.toLowerCase() === 'yes' ? 'yes' : 'no') : 'secondary'}
                className={styles.outcomeBtn}
                onClick={() => setSelectedOutcome(outcome)}
              >
                {outcome}
              </Button>
            ))}
          </div>

          <div className={styles.tradeForm}>
            <Input
              label="Количество акций"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div className={styles.tradeSummary}>
              <div className={styles.tradeSummaryRow}>
                <span>Цена за акцию</span>
                <span className={styles.tradeSummaryValue}>{formatCurrency(price)}</span>
              </div>
              <div className={styles.tradeSummaryRow}>
                <span>Стоимость</span>
                <span className={styles.tradeSummaryValue}>{formatCurrency(cost)}</span>
              </div>
              <div className={styles.tradeSummaryRow}>
                <span>Потенциальная прибыль</span>
                <span className={`${styles.tradeSummaryValue} ${styles.profitValue}`}>
                  +{formatCurrency(potentialProfit)}
                </span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              variant={selectedOutcome.toLowerCase() === 'yes' ? 'yes' : 'no'}
              isLoading={isCreating}
              disabled={currentMarket.status !== 'ACTIVE' || qty <= 0}
              onClick={handleOrder}
            >
              Купить «{selectedOutcome}» за {formatCurrency(cost)}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
