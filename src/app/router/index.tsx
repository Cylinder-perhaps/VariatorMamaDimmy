import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@app/layouts/MainLayout';
import { AuthPage } from '@pages/AuthPage';
import { HomePage } from '@pages/HomePage';
import { MarketPage } from '@pages/MarketPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { PortfolioPage } from '@pages/PortfolioPage';
import { AdminPage } from '@pages/AdminPage';
import { useAuthStore } from '@entities/user/model/store';

import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user?.role !== 'admin' && user?.role !== 'moderator') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/markets/:id" element={<MarketPage />} />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <PortfolioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
