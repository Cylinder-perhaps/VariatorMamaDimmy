import eslint from '@eslint/js';
import tanstackPlugin from '@tanstack/eslint-plugin-query';
import tsEslintParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.recommendedTypeChecked,
  jsxA11y.flatConfigs.recommended,
  prettierConfig,
  eslintPluginPrettier,

  // Основная конфигурация
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tsEslintParser,
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefresh,
      '@tanstack/query': tanstackPlugin,
      'import': importPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      ...tanstackPlugin.configs.recommended.rules,

      '@typescript-eslint/no-unused-vars': ['error', { 'varsIgnorePattern': '^_' }],
      'curly': ['error', 'all'],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['multiline-block-like', 'return', 'multiline-expression', 'switch', 'try'],
        },
        {
          blankLine: 'always',
          prev: ['multiline-block-like', 'multiline-expression', 'switch', 'try'],
          next: '*',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'src/*',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'react/prop-types': 'off',
    },
    ignores: ['node_modules', 'build'],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  // TSX-специфичные настройки
  {
    files: ['**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['celds-uikit/reset.css'],
              message:
                'Не импортируйте reset дизайн-системы в микрофронт. Reset-файл тянется из хоста. Reset можно использовать только при локальной разработке',
            },
          ],
        },
      ],
      'max-lines': [
        'warn',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'react/forbid-component-props': [
        'warn',
        {
          forbid: ['style'],
        },
      ],
    },
  },

  // JS-специфичные настройки
  {
    files: ['**/*.js'],
    extends: [tsEslint.configs.disableTypeChecked],
  },
);
