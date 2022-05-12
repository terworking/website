import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetMini,
  transformerDirectives,
} from 'unocss';

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
  transformers: [transformerDirectives()],
  safelist: [
    ...['github', 'instagram', 'youtube'].map((it) => `i-tabler-brand-${it}`), // Social icons
    ...['lime', 'fuchsia', 'rose', 'indigo'].reduce(
      // Birthday's cards color
      (prev, next) =>
        prev.concat(
          `bg-${next}-200 divide-${next}-800 dark:bg-${next}-800 dark:divide-${next}-200`.split(
            ' '
          )
        ),
      []
    ),
  ],
  shortcuts: {
    'bg-body': 'bg-white dark:bg-dark-800',
    'bg-secondary': 'bg-light-500 dark:bg-dark-500',
    'border-primary': 'border-black/20 dark:border-white/20',
    'text-body': 'text-black dark:text-white',
    'text-accent': 'text-$accent dark:text-$accent-dark',
  },
});
