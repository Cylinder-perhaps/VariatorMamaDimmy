import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { useAuthStore } from '@entities/user/model/store';
import { adminApi } from '@shared/api';
import { Button, Input } from '@shared/ui';
import type { User } from '@shared/types';

import styles from './AdminPage.module.css';

interface CreateMarketFormData {
  title: string;
  description: string;
  deadline: string;
  category: string;
  outcomes: { value: string }[];
}

type TabType = 'markets' | 'users';

export const AdminPage = () => {
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('markets');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Users Tab State
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMarketFormData>({
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      category: '',
      outcomes: [{ value: '' }, { value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'outcomes',
  });

  const onSubmit = async (data: CreateMarketFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const filteredOutcomes = data.outcomes
        .map((o) => o.value.trim())
        .filter((o) => o.length > 0);

      if (filteredOutcomes.length < 2) {
        setError('Необходимо указать минимум 2 исхода');
        setIsLoading(false);
        return;
      }

      // Convert datetime-local value to ISO Date with UTC timezone or keep it as is if it can be parsed.
      // API expects format-date-time (RFC3339). HTML input datetime-local produces YYYY-MM-DDTHH:mm
      const deadlineDate = new Date(data.deadline);

      await adminApi.createMarket({
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        deadline: deadlineDate.toISOString(),
        outcomes: filteredOutcomes,
      });

      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Ошибка при создании маркета');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (targetPage: number) => {
    try {
      setIsUsersLoading(true);
      setUsersError(null);
      const { data } = await adminApi.listUsers({ page: targetPage, per_page: 20 });
      setUsers(data.data);
      setTotalPages(data.meta.pages);
    } catch (err: any) {
      setUsersError(err?.response?.data?.error?.message || 'Ошибка загрузки пользователей');
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && currentUser?.role === 'admin') {
      fetchUsers(page);
    }
  }, [activeTab, page, currentUser?.role]);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'moderator') => {
    try {
      await adminApi.updateUserRole(userId, { role: newRole });
      fetchUsers(page); // Reload to get updated data
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || 'Ошибка обновления роли');
    }
  };

  const getRoleBadgeClass = (role: string) => {
    if (role === 'admin') return styles.roleAdmin;
    if (role === 'moderator') return styles.roleModerator;
    return styles.roleUser;
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Админ-панель</h1>

      {currentUser?.role === 'admin' && (
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'markets' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('markets')}
          >
            Создание рынка
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
        </div>
      )}

      {activeTab === 'markets' && (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && <div className={styles.formError}>{error}</div>}
          {success && <div className={styles.formSuccess}>Рынок успешно создан!</div>}

        <Input
          label="Название события"
          placeholder="Кто станет президентом в 2028?"
          error={errors.title?.message}
          {...register('title', {
            required: 'Введите название',
            minLength: { value: 5, message: 'Минимум 5 символов' },
          })}
        />

        <Input
          label="Описание (опционально)"
          placeholder="Подробности события..."
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          label="Дедлайн"
          type="datetime-local"
          error={errors.deadline?.message}
          {...register('deadline', { required: 'Укажите дату и время окончания' })}
        />

        <Input
          label="Категория (опционально)"
          placeholder="politics, technology..."
          error={errors.category?.message}
          {...register('category')}
        />

        <div className={styles.outcomes}>
          <div className={styles.outcomesTitle}>Исходы</div>
          {fields.map((field, index) => (
            <div key={field.id} className={styles.outcomeRow}>
              <Input
                label={`Исход ${index + 1}`}
                placeholder="Кандидат A..."
                error={errors.outcomes?.[index]?.value?.message}
                {...register(`outcomes.${index}.value` as const, {
                  required: 'Укажите исход',
                })}
              />
              {fields.length > 2 && (
                <div className={styles.removeBtn}>
                  <Button type="button" variant="secondary" size="md" onClick={() => remove(index)}>
                    Удалить
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={() => append({ value: '' })}>
            Добавить исход
          </Button>
        </div>

          <Button type="submit" isLoading={isLoading} fullWidth size="lg">
            Создать рынок
          </Button>
        </form>
      )}

      {activeTab === 'users' && currentUser?.role === 'admin' && (
        <div className={styles.usersContainer}>
          {usersError && <div className={styles.error}>{usersError}</div>}
          
          {isUsersLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <>
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Текущая роль</th>
                    <th>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>
                        <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <select
                          className={styles.roleSelect}
                          value={user.role}
                          disabled={user.role === 'admin' || user.id === currentUser.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'moderator')}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          {user.role === 'admin' && <option value="admin">Admin</option>}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Назад
                  </Button>
                  <span className={styles.pageInfo}>
                    Страница {page} из {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Вперед
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
