import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@entities/user/model/store';
import { Button, Input, Tabs } from '@shared/ui';

import styles from './AuthPage.module.css';

interface AuthFormData {
  email: string;
  password: string;
}

export const AuthPage = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { login, register: registerUser, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>();

  if (isAuthenticated) {
    navigate('/', { replace: true });

    return null;
  }

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (tab === 'login') {
        await login(data.email, data.password);
      } else {
        await registerUser(data.email, data.password);
      }

      navigate('/');
    } catch {
      // error is set in store
    }
  };

  const handleTabChange = (key: string) => {
    setTab(key as 'login' | 'register');
    clearError();
    reset();
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {tab === 'login' ? 'Вход' : 'Регистрация'}
        </h1>
        <p className={styles.subtitle}>
          {tab === 'login'
            ? 'Войдите для доступа к торговле'
            : 'Создайте аккаунт для начала'}
        </p>

        <Tabs
          className={styles.tabs}
          tabs={[
            { key: 'login', label: 'Вход' },
            { key: 'register', label: 'Регистрация' },
          ]}
          activeTab={tab}
          onChange={handleTabChange}
        />

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Введите email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Неверный формат email',
              },
            })}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Минимум 8 символов"
            error={errors.password?.message}
            {...register('password', {
              required: 'Введите пароль',
              minLength: {
                value: 8,
                message: 'Пароль минимум 8 символов',
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                message: 'Пароль должен содержать буквы и цифры',
              },
            })}
          />

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            {tab === 'login' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>
      </div>
    </div>
  );
};
