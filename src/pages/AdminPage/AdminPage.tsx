import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { adminApi } from '@shared/api';
import { Button, Input } from '@shared/ui';

import styles from './AdminPage.module.css';

interface CreateMarketFormData {
  title: string;
  description: string;
  deadline: string;
  category: string;
  outcomes: { value: string }[];
}

export const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Админ-панель: Создание рынка</h1>

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
    </div>
  );
};
