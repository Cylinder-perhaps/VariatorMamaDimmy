import { useEffect } from 'react';

import { useBalanceStore } from '@entities/balance/model/store';
import { useOrdersStore } from '@entities/order/model/store';
import { usePositionsStore } from '@entities/position/model/store';
import { useTradesStore } from '@entities/trade/model/store';
import { formatCurrency, formatDateTime } from '@shared/lib/format';
import { Badge, Button, Card, Spinner, orderStatusVariant, toast } from '@shared/ui';

import styles from './PortfolioPage.module.css';

export const PortfolioPage = () => {
  const { balance, isLoading: loadingBalance, fetchBalance } = useBalanceStore();
  const { positions, isLoading: loadingPositions, fetchPositions } = usePositionsStore();
  const { orders, isLoading: loadingOrders, fetchMyOrders, cancelOrder } = useOrdersStore();
  const { trades, isLoading: loadingTrades, fetchTrades } = useTradesStore();

  useEffect(() => {
    void fetchBalance();
    void fetchPositions();
    void fetchMyOrders();
    void fetchTrades();
  }, [fetchBalance, fetchPositions, fetchMyOrders, fetchTrades]);

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success('Ордер отменён');
      void fetchBalance();
    } catch {
      toast.error('Не удалось отменить ордер');
    }
  };

  const isLoading = loadingBalance || loadingPositions || loadingOrders || loadingTrades;

  if (isLoading && !balance) {
    return <Spinner centered size="lg" />;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Портфель</h1>

      {/* Balance Cards */}
      <div className={styles.balanceGrid}>
        <Card compact>
          <div className={styles.balanceCard}>
            <div className={styles.balanceLabel}>Общий баланс</div>
            <div className={`${styles.balanceValue} ${styles.balanceTotal}`}>
              {balance ? formatCurrency(balance.total) : '—'}
            </div>
          </div>
        </Card>
        <Card compact>
          <div className={styles.balanceCard}>
            <div className={styles.balanceLabel}>Доступно</div>
            <div className={styles.balanceValue}>
              {balance ? formatCurrency(balance.available) : '—'}
            </div>
          </div>
        </Card>
        <Card compact>
          <div className={styles.balanceCard}>
            <div className={styles.balanceLabel}>Заблокировано</div>
            <div className={`${styles.balanceValue} ${styles.balanceBlocked}`}>
              {balance ? formatCurrency(balance.blocked_in_orders) : '—'}
            </div>
          </div>
        </Card>
      </div>

      {/* Positions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Позиции ({positions.length})</h2>
        {positions.length === 0 ? (
          <Card compact><div className={styles.empty}>У вас пока нет позиций</div></Card>
        ) : (
          <Card noPadding>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Рынок</th>
                  <th>Исход</th>
                  <th>Кол-во</th>
                  <th>Ср. цена</th>
                  <th>Стоимость</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => (
                  <tr key={`${pos.market_id}-${pos.outcome}`}>
                    <td>{pos.market_title}</td>
                    <td><Badge variant={pos.outcome.toLowerCase() === 'yes' ? 'yes' : 'no'}>{pos.outcome}</Badge></td>
                    <td>{pos.quantity}</td>
                    <td>{formatCurrency(pos.avg_cost)}</td>
                    <td>{formatCurrency(pos.current_value)}</td>
                    <td className={pos.pnl >= 0 ? styles.positive : styles.negative}>
                      {pos.pnl >= 0 ? '+' : ''}{formatCurrency(pos.pnl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Orders */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Ордера ({orders.length})</h2>
        {orders.length === 0 ? (
          <Card compact><div className={styles.empty}>Нет активных ордеров</div></Card>
        ) : (
          <Card noPadding>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Исход</th>
                  <th>Кол-во</th>
                  <th>Цена</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Дата</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><Badge variant={order.outcome.toLowerCase() === 'yes' ? 'yes' : 'no'}>{order.outcome}</Badge></td>
                    <td>{order.quantity}</td>
                    <td>{formatCurrency(order.price)}</td>
                    <td>{formatCurrency(order.amount_paid)}</td>
                    <td><Badge variant={orderStatusVariant[order.status] || 'default'}>{order.status}</Badge></td>
                    <td>{formatDateTime(order.created_at)}</td>
                    <td>
                      {order.status === 'PENDING' && (
                        <Button size="sm" variant="danger" onClick={() => handleCancel(order.id)}>
                          Отменить
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Trades */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>История сделок ({trades.length})</h2>
        {trades.length === 0 ? (
          <Card compact><div className={styles.empty}>Нет исполненных сделок</div></Card>
        ) : (
          <Card noPadding>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Рынок</th>
                  <th>Исход</th>
                  <th>Кол-во</th>
                  <th>Цена</th>
                  <th>P&L</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{trade.market_title}</td>
                    <td><Badge variant={trade.outcome.toLowerCase() === 'yes' ? 'yes' : 'no'}>{trade.outcome}</Badge></td>
                    <td>{trade.quantity}</td>
                    <td>{formatCurrency(trade.price)}</td>
                    <td className={trade.pnl >= 0 ? styles.positive : styles.negative}>
                      {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                    </td>
                    <td>{formatDateTime(trade.executed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
};
