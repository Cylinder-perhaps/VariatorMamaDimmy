import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMarketsStore } from '@entities/market/model/store';
import { useOrdersStore } from '@entities/order/model/store';
import { useAuthStore } from '@entities/user/model/store';
import { adminApi } from '@shared/api';
import { formatCurrency, formatDate, formatRelativeTime } from '@shared/lib/format';
import { Badge, Button, Card, Input, Spinner, marketStatusVariant, toast } from '@shared/ui';

import styles from './MarketPage.module.css';

export const MarketPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentMarket, isLoadingDetails, fetchMarketById } = useMarketsStore();
  const { createOrder, isCreating } = useOrdersStore();
  const { isAuthenticated, user } = useAuthStore();

  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('10');

  // Admin / Moderator resolve state
  const [resolveOutcome, setResolveOutcome] = useState<string>('');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    if (id) {
      void fetchMarketById(id);
    }
  }, [id, fetchMarketById]);

  useEffect(() => {
    if (currentMarket?.outcomes?.[0]) {
      if (!selectedOutcome) setSelectedOutcome(currentMarket.outcomes[0]);
      if (!resolveOutcome) setResolveOutcome(currentMarket.outcomes[0]);
    }
  }, [currentMarket, selectedOutcome, resolveOutcome]);

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

  // Цена для MVP (стоимость 1 акции)
  const price = currentMarket.outcomes.length > 0 ? 1 / currentMarket.outcomes.length : 0.5;
  const qty = parseInt(quantity) || 0;
  const cost = qty * price;





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

  const handleResolve = async () => {
    if (!id || !resolveOutcome) return;
    try {
      setIsResolving(true);
      await adminApi.resolveMarket(id, {
        winning_outcome: resolveOutcome,
        evidence_url: evidenceUrl || null,
      });
      toast.success(`Рынок завершён. Исход: ${resolveOutcome}`);
      void fetchMarketById(id);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Ошибка разрешения рынка');
    } finally {
      setIsResolving(false);
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


        {/* Right: Trade Panel */}
        <Card className={styles.tradeCard}>
          {currentMarket.status === 'RESOLVED' && currentMarket.resolved_outcome ? (
            <>
              <h3 className={styles.tradeTitle}>Событие завершено</h3>
              <div className={styles.resolvedBanner}>
                Победивший исход: <strong>{currentMarket.resolved_outcome}</strong>
              </div>
            </>
          ) : (
            <>
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
                    <span>Ставка (стоимость)</span>
                    <span className={styles.tradeSummaryValue}>{formatCurrency(cost)}</span>
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
                  Купить «{selectedOutcome}»
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Resolve Market Block (Admin/Moderator) */}
        {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') && currentMarket.status === 'ACTIVE' && (
          <Card className={styles.resolveCard}>
            <h3 className={styles.resolveTitle}>Завершение события (Admin)</h3>
            <div className={styles.resolveForm}>
              <select
                className={styles.resolveSelect}
                value={resolveOutcome}
                onChange={(e) => setResolveOutcome(e.target.value)}
              >
                {currentMarket.outcomes.map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {outcome}
                  </option>
                ))}
              </select>
              <Input
                label="Доказательство (опционально, URL)"
                placeholder="https://..."
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
              />
              <Button
                fullWidth
                size="md"
                variant="danger"
                isLoading={isResolving}
                onClick={handleResolve}
              >
                Завершить событие
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
