import { useNavigate } from 'react-router-dom';

import { Button } from '@shared/ui';

import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.icon}>🔍</div>
      <h1 className={styles.title}>404</h1>
      <p className={styles.desc}>Страница не найдена</p>
      <Button onClick={() => navigate('/')}>На главную</Button>
    </div>
  );
};
