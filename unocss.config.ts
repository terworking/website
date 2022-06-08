// @ts-expect-error It should work
import formkitUnoCSS from '@formkit/themes/unocss';

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetTypography,
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
    presetTypography({
      cssExtend: {
        'h2 a,h3 a,h4 a': {
          'text-decoration': 'none',
        },
        'h2 a:hover,h3 a:hover, h4 a:hover': {
          'text-decoration': 'revert',
        },
        'ol,ul': {
          'margin-bottom': '0.25em',
          'margin-top': '0.25em',
        },
        'pre': {
          'border-color': 'var(--shiki-color-border)',
          'border-style': 'solid',
          'border-width': '1px',
        },
        'pre,code': {
          background: 'var(--shiki-color-background)',
        },
      },
    }),
  ],
  shortcuts: [
    {
      'bg-body': 'bg-white dark:bg-dark-800',
      'bg-secondary': 'bg-light-500 dark:bg-dark-500',
      'border-primary': 'border-black/20 dark:border-white/20',
      'text-body': 'text-black dark:text-white',
      'card':
        'rounded-lg bg-white dark:bg-dark-500 border border-light-900 dark:border-dark-100 shadow-lg',
      'content-placeholder':
        'inline-block mx-1 min-h-1em bg-light-900 dark:bg-dark-100 cursor-wait animate-pulse',
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
