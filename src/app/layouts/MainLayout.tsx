import { Outlet } from 'react-router-dom';

import { Header } from '@widgets/Header';

import styles from './MainLayout.module.css';

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Variator — Prediction Market Platform
      </footer>
    </div>
  );
};
