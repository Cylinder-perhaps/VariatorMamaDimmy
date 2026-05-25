import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

let toastIdCounter = 0;
let addToastFn: ((type: ToastType, message: string) => void) | null = null;

/**
 * Глобальная функция для показа toast-уведомлений
 */
export const toast = {
  success: (message: string) => addToastFn?.('success', message),
  error: (message: string) => addToastFn?.('error', message),
  warning: (message: string) => addToastFn?.('warning', message),
  info: (message: string) => addToastFn?.('info', message),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = ++toastIdCounter;

      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  useEffect(() => {
    addToastFn = addToast;

    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  const container = document.getElementById('notification') || document.body;

  return createPortal(
    <div className={styles.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[t.type]} ${t.exiting ? styles.exiting : ''}`}
        >
          <span className={styles.icon}>{ICONS[t.type]}</span>
          <span className={styles.message}>{t.message}</span>
          <button className={styles.closeBtn} onClick={() => removeToast(t.id)} aria-label="Закрыть">
            ✕
          </button>
        </div>
      ))}
    </div>,
    container,
  );
};
