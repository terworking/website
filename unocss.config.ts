// @ts-expect-error It should work
import formkitUnoCSS from '@formkit/themes/unocss';

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { presetScrollbar } from 'unocss-preset-scrollbar';

export default defineConfig({
  presets: [
    formkitUnoCSS(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        height: '1.5rem',
        margin: '0.75rem',
        width: '1.5rem',
      },
    }),
    presetScrollbar(),
    presetUno(),
  ],
  shortcuts: [
    {
      'bg-body': 'bg-white dark:bg-dark-800',
      'bg-secondary': 'bg-light-500 dark:bg-dark-500',
      'border-primary': 'border-black/20 dark:border-white/20',
      'text-body': 'text-black dark:text-white',
    },
    [
      /^(bg|border|text)-accent$/,
      ([, v]) => `${v}-$accent dark:${v}-$accent-dark`,
    ],
  ],
  transformers: [
    transformerCompileClass({ classPrefix: 'u-' }),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
