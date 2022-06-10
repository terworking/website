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
      'bg-card': 'bg-white dark:bg-dark-500',
      'bg-secondary': 'bg-light-500 dark:bg-dark-500',
      'bg-placeholder': 'bg-light-900 dark:bg-dark-100',
      'border-card': 'border-light-900 dark:border-dark-100',
      'border-primary': 'border-black/20 dark:border-white/20',
      'text-body': 'text-black dark:text-white',
      'card': 'bg-card border border-rounded-lg border-card',
      'content-placeholder': 'bg-placeholder cursor-wait',
      'text-placeholder':
        'inline-block mx-1 min-h-1em content-placeholder animate-pulse',
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
