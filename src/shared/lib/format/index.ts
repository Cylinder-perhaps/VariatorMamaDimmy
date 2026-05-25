/**
 * Форматирует число как валюту: $1,234.56
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Форматирует цену акции: $0.45
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Форматирует вероятность: 45%
 */
export function formatProbability(price: number): string {
  return `${Math.round(price * 100)}%`;
}

/**
 * Форматирует P&L с знаком и цветом
 */
export function formatPnl(pnl: number): { text: string; isPositive: boolean } {
  const sign = pnl >= 0 ? '+' : '';

  return {
    text: `${sign}${formatCurrency(pnl)}`,
    isPositive: pnl >= 0,
  };
}

/**
 * Форматирует дату: "12 мая 2026"
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Форматирует дату-время: "12 мая 2026, 14:30"
 */
export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

/**
 * Относительное время: "через 3 дня", "5 часов назад"
 */
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const target = new Date(dateStr).getTime();
  const diff = target - now;
  const absDiff = Math.abs(diff);
  const isFuture = diff > 0;

  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(absDiff / 3600000);
  const days = Math.floor(absDiff / 86400000);

  let text: string;

  if (minutes < 1) {
    text = 'только что';

    return text;
  } else if (minutes < 60) {
    text = `${minutes} мин`;
  } else if (hours < 24) {
    text = `${hours} ч`;
  } else if (days < 30) {
    text = `${days} дн`;
  } else {
    return formatDate(dateStr);
  }

  return isFuture ? `через ${text}` : `${text} назад`;
}

/**
 * Сокращённое число: 1.2K, 3.5M
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
}
