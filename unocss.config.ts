import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetMini,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetIcons({
      extraProperties: {
        margin: '0.75rem',
        width: '1.5rem',
        height: '1.5rem',
      },
    }),
    presetMini(),
  ],
  transformers: [
    transformerCompileClass({ classPrefix: 'u-' }),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      'bg-body': 'bg-white dark:bg-dark-800',
      'text-body': 'text-black dark:text-white',
      'bg-secondary': 'bg-light-500 dark:bg-dark-500',
      'border-primary': 'border-black/20 dark:border-white/20',
    },
    [
      /^(bg|border|text)-accent$/,
      ([, v]) => `${v}-$accent dark:${v}-$accent-dark`,
    ],
  ],
})
