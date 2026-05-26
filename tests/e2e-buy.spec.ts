import { test, expect } from '@playwright/test';

test.describe('E2E: Регистрация и покупка ордера (с мокированием API)', () => {
  const testEmail = `buyer+${Date.now()}@example.com`;
  const testPassword = 'SecurePass123';

  test('Должен успешно зарегистрироваться, выбрать рынок и купить акции', async ({ page }) => {
    // 1. Мокируем API ответы бэкенда, чтобы тест работал абсолютно надежно
    
    // Мок регистрации
    await page.route('**/api/auth/register', async route => {
      await route.fulfill({
        status: 201,
        json: {
          access_token: 'mock_jwt_token',
          refresh_token: 'mock_refresh_token',
          user: { id: 'user-1', email: testEmail, role: 'user' }
        }
      });
    });

    // Мок списка рынков (для главной страницы)
    await page.route('**/api/markets*', async route => {
      // Игнорируем запросы конкретного рынка в этом обработчике
      if (route.request().url().match(/\/api\/markets\/[a-zA-Z0-9-]+$/)) {
        return route.fallback();
      }
      await route.fulfill({
        status: 200,
        json: {
          data: [
            {
              id: 'market-1',
              title: 'Событие для E2E теста',
              status: 'ACTIVE',
              outcomes: ['Yes', 'No'],
              deadline: new Date(Date.now() + 86400000).toISOString(),
              created_at: new Date().toISOString(),
            }
          ],
          meta: { total: 1, page: 1, per_page: 20 }
        }
      });
    });

    // Мок получения деталей конкретного рынка
    await page.route('**/api/markets/market-1', async route => {
      await route.fulfill({
        status: 200,
        json: {
          id: 'market-1',
          title: 'Событие для E2E теста',
          description: 'Описание тестового события',
          status: 'ACTIVE',
          outcomes: ['Yes', 'No'],
          deadline: new Date(Date.now() + 86400000).toISOString(),
          created_at: new Date().toISOString(),
          pools: {} // Пулов нет, как мы и выяснили
        }
      });
    });

    // Мок создания ордера
    await page.route('**/api/orders', async route => {
      await route.fulfill({
        status: 201,
        json: {
          id: 'order-123',
          market_id: 'market-1',
          outcome: 'Yes',
          quantity: 10,
          price: 0.5,
          amount_paid: 5,
          status: 'OPEN',
          created_at: new Date().toISOString()
        }
      });
    });

    // 2. Шаги теста: Регистрация
    await page.goto('/auth');
    
    // Переключаемся на вкладку "Регистрация"
    await page.getByRole('button', { name: 'Регистрация' }).click();

    // Заполняем форму
    await page.getByPlaceholder('user@example.com').fill(testEmail);
    await page.getByPlaceholder('Минимум 8 символов').fill(testPassword);
    
    // Отправляем
    await page.getByRole('button', { name: 'Создать аккаунт' }).click();

    // 3. Переход на главную и выбор рынка
    // Ждём, пока загрузится главная страница с рынками
    await expect(page).toHaveURL('/');
    
    // Кликаем по карточке рынка
    const marketCard = page.locator('text=Событие для E2E теста');
    await expect(marketCard).toBeVisible();
    await marketCard.click();

    // 4. Покупка ордера на странице рынка
    // Проверяем, что перешли на страницу рынка
    await expect(page).toHaveURL(/\/markets\/market-1/);

    // Выбираем исход "Yes"
    await page.getByRole('button', { name: 'Yes', exact: true }).click();

    // Вводим количество 10 (оно уже может быть по умолчанию, но введем явно)
    const quantityInput = page.getByLabel(/Количество акций/i);
    await quantityInput.fill('');
    await quantityInput.fill('10');

    // Кликаем кнопку покупки
    await page.getByRole('button', { name: 'Купить «Yes»' }).click();

    // Проверяем, что появилось уведомление об успехе
    await expect(page.locator('text=Ордер на 10 акций «Yes» создан!')).toBeVisible();
  });
});
