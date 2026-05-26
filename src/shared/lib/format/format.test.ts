import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  formatCurrency,
  formatPrice,
  formatProbability,
  formatPnl,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatCompact
} from './index';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });
  });

  describe('formatPrice', () => {
    it('formats price to 2 decimal places', () => {
      expect(formatPrice(0.456)).toBe('$0.46');
      expect(formatPrice(1)).toBe('$1.00');
    });
  });

  describe('formatProbability', () => {
    it('converts decimal to percentage', () => {
      expect(formatProbability(0.45)).toBe('45%');
      expect(formatProbability(0.456)).toBe('46%');
      expect(formatProbability(1)).toBe('100%');
    });
  });

  describe('formatPnl', () => {
    it('formats positive PNL', () => {
      const result = formatPnl(100.50);
      expect(result.text).toBe('+$100.50');
      expect(result.isPositive).toBe(true);
    });

    it('formats negative PNL', () => {
      const result = formatPnl(-50.25);
      expect(result.text).toBe('-$50.25');
      expect(result.isPositive).toBe(false);
    });

    it('formats zero PNL', () => {
      const result = formatPnl(0);
      expect(result.text).toBe('+$0.00');
      expect(result.isPositive).toBe(true);
    });
  });

  describe('formatDate', () => {
    it('formats date correctly in ru-RU locale', () => {
      // Use a fixed date to avoid timezone issues in testing
      const dateStr = '2026-05-12T10:00:00Z';
      const formatted = formatDate(dateStr);
      expect(formatted).toContain('мая 2026');
      expect(formatted).toMatch(/12\s+мая\s+2026/); // '12 мая 2026 г.' or similar depending on Node environment
    });
  });

  describe('formatCompact', () => {
    it('formats millions', () => {
      expect(formatCompact(1500000)).toBe('1.5M');
      expect(formatCompact(2000000)).toBe('2.0M');
    });

    it('formats thousands', () => {
      expect(formatCompact(1500)).toBe('1.5K');
      expect(formatCompact(1000)).toBe('1.0K');
    });

    it('returns string for small numbers', () => {
      expect(formatCompact(999)).toBe('999');
      expect(formatCompact(0)).toBe('0');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-05-26T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('formats just now', () => {
      expect(formatRelativeTime('2026-05-26T12:00:10Z')).toBe('только что');
      expect(formatRelativeTime('2026-05-26T11:59:50Z')).toBe('только что');
    });

    it('formats minutes in future', () => {
      expect(formatRelativeTime('2026-05-26T12:30:00Z')).toBe('через 30 мин');
    });

    it('formats minutes in past', () => {
      expect(formatRelativeTime('2026-05-26T11:30:00Z')).toBe('30 мин назад');
    });

    it('formats hours in future', () => {
      expect(formatRelativeTime('2026-05-26T17:00:00Z')).toBe('через 5 ч');
    });

    it('formats days in past', () => {
      expect(formatRelativeTime('2026-05-20T12:00:00Z')).toBe('6 дн назад');
    });

    it('formats absolute date for long periods', () => {
      const pastStr = '2025-01-01T12:00:00Z';
      expect(formatRelativeTime(pastStr)).toBe(formatDate(pastStr));
    });
  });
});
