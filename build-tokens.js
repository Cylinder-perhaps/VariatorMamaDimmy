 StyleDictionary = require('style-dictionary');

StyleDictionary.registerFormat({
  name: 'typescript/vanilla-extract',
  formatter: function ({ dictionary }) {
    function cleanDictionary(obj) {
      const result = {};
      for (const key in obj) {
        if (obj[key].hasOwnProperty('value')) {
          result[key] = obj[key].value;
        } else {
          result[key] = cleanDictionary(obj[key]);
        }
      }
      return result;
    }

    const cleanTokens = cleanDictionary(dictionary.properties);
    const jsonString = JSON.stringify(cleanTokens, null, 2);

    return (
      `// ВНИМАНИЕ: Файл сгенерирован автоматически. Не редактируйте вручную!\n` +
      `import { createGlobalTheme } from '@vanilla-extract/css';\n\n` +
      `export const vars = createGlobalTheme(':root', ${jsonString});\n`
    );
  },
});

const styleDictionaryConfig = StyleDictionary.extend({
  source: ['tokens.json'],

  platforms: {
    vanillaExtract: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'theme.css.ts',
          format: 'typescript/vanilla-extract',
        },
      ],
    },
  },
});

styleDictionaryConfig.buildAllPlatforms();
