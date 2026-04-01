export default {
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'scope-empty': [2, 'never'],
  },
  prompt: {
    questions: {
      type: {
        description: 'Select the type of change',
        enum: {
          feat: {
            description: 'Новая функциональность',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'Багфикс/хотфикс',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          refactor: {
            description:
              'Изменения которые не относятся к исправлению ошибок и не вносят новую функциональность (декомпозиция компонентов, улучшение читаемости кода и тд)',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          test: {
            description: 'Изменения которые относятся исключительно к написанию тестов',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description:
              'Изменения затрагивающие билд. Это может быть фикс сборки, бамп зависимостей, добавление или удаление правил линтера и тп',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description:
              'Изменения затрагивающие CI. Как правило конфигурационные файлы (docker, gitlab и тп)',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: 'Иные изменения',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: 'Изменения которые относятся к откату коммитов (git revert)',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: 'Номер задачи',
      },
      subject: {
        description: 'Короткое описание изменений',
      },
      body: {
        description: 'Подробное описание изменений',
      },
      isBreaking: {
        description: 'Добавлены критические изменения, нарушающие обратную совместимость ПО?',
      },
      breakingBody: {
        description: 'Подробное описание критических изменений',
      },
      breaking: {
        description: 'Короткое описание критических изменений',
      },
      isIssueAffected: {
        description: 'Это изменение затрагивает какие-либо issues?',
      },
      issuesBody: {
        description: 'Подробное описание, каким образом изменения затрагивают issues',
      },
      issues: {
        description: 'Уточните, какие issues затронуты (пример: "fix #123", "re #123".)',
      },
    },
  },
};
