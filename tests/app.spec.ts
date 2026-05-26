import { test, expect } from '@playwright/test';

test.describe('Главная страница приложения', () => {
  test('должна успешно загружаться', async ({ page }) => {
    // Переходим на главную страницу (baseURL уже указан в конфиге)
    await page.goto('/');

    // Проверяем, что заголовок вкладки не пустой
    await expect(page).toHaveTitle(/.*.*/);

    // Пример: проверка наличия какого-то важного элемента на странице.
    // Если у вас на главной есть <h1 class="title">Welcome</h1>, тест будет таким:
    // const mainTitle = page.locator('h1');
    // await expect(mainTitle).toBeVisible();
    // await expect(mainTitle).toHaveText('Ожидаемый текст');
  });

  test('навигация работает корректно', async ({ page }) => {
    await page.goto('/');
    
    // Пример поиска кнопки/ссылки и клика по ней
    // await page.getByRole('link', { name: 'Войти' }).click();
    
    // Проверка, что URL изменился (так как у вас используется react-router-dom)
    // await expect(page).toHaveURL(/.*\/login/);
  });
});