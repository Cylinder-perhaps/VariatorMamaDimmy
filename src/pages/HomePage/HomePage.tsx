import { useEffect } from 'react';

import { useMarketsStore } from '@entities/market/model/store';
import type { MarketStatus } from '@shared/types';
import { Pagination, Select, Skeleton } from '@shared/ui';
import { MarketCard } from '@widgets/MarketCard';

import styles from './HomePage.module.css';

export const HomePage = () => {
  const { markets, meta, filters, isLoading, fetchMarkets, setFilters } = useMarketsStore();

  useEffect(() => {
    void fetchMarkets();
  }, [fetchMarkets]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as MarketStatus | '';
    const newFilters = { ...filters, page: 1, status: status || undefined };

    setFilters(newFilters);
    void fetchMarkets(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort_by = e.target.value as 'created_at' | 'deadline' | 'liquidity';
    const newFilters = { ...filters, page: 1, sort_by };

    setFilters(newFilters);
    void fetchMarkets(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };

    setFilters(newFilters);
    void fetchMarkets(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Прогнозируй <span className={styles.heroAccent}>будущее</span>
        </h1>
        <p className={styles.heroDesc}>
          Торгуйте акциями событий и зарабатывайте на правильных прогнозах.
          Цена акции = вероятность события.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <Select
            options={[
              { value: '', label: 'Все статусы' },
              { value: 'ACTIVE', label: 'Активные' },
              { value: 'CLOSED', label: 'Закрытые' },
              { value: 'RESOLVED', label: 'Завершённые' },
            ]}
            value={filters.status || ''}
            onChange={handleStatusChange}
          />
          <Select
            options={[
              { value: 'created_at', label: 'По дате' },
              { value: 'deadline', label: 'По дедлайну' },
              { value: 'liquidity', label: 'По ликвидности' },
            ]}
            value={filters.sort_by || 'created_at'}
            onChange={handleSortChange}
          />
        </div>
        {meta && (
          <span className={styles.count}>
            {meta.total} {meta.total === 1 ? 'рынок' : 'рынков'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={220} />
          ))}
        </div>
      ) : markets.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>Рынки не найдены</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>

          {meta && meta.pages > 1 && (
            <Pagination
              page={filters.page || 1}
              totalPages={meta.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
