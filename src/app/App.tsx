import { useEffect } from 'react';

import { useAuthStore } from '@entities/user/model/store';
import { useThemeStore } from '@shared/lib/theme/store';
import { ToastContainer } from '@shared/ui';

import { AppRouter } from './router';

import './styles/reset.scss';
import './styles/global.css';

export const App = () => {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
};
