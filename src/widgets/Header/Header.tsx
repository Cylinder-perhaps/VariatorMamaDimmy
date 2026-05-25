import { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useBalanceStore } from '@entities/balance/model/store';
import { useAuthStore } from '@entities/user/model/store';
import { formatCurrency } from '@shared/lib/format';
import { useThemeStore } from '@shared/lib/theme/store';
import { Button } from '@shared/ui';

import styles from './Header.module.css';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { balance, fetchBalance } = useBalanceStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      void fetchBalance();
    }
  }, [isAuthenticated, fetchBalance]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>V</span>
            Variator
          </Link>

          <nav className={styles.nav}>
            <NavLink to="/" className={navLinkClass} end>
              Рынки
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/portfolio" className={navLinkClass}>
                Портфель
              </NavLink>
            )}
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') && (
              <NavLink to="/admin" className={navLinkClass}>
                Админ-панель
              </NavLink>
            )}
          </nav>
        </div>

        <div className={styles.right}>
          {isAuthenticated && balance && (
            <div className={styles.balance}>
              <span className={styles.balanceIcon}>💰</span>
              {formatCurrency(balance.available)}
            </div>
          )}

          <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Сменить тему">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              <button className={styles.userMenu} onClick={handleLogout}>
                <span className={styles.avatar}>{user?.email?.[0] || '?'}</span>
                Выйти
              </button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
