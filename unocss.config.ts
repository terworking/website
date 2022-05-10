import { defineConfig, presetIcons, presetWind } from 'unocss';

export default defineConfig({
  presets: [presetIcons({ warn: true }), presetWind()],
  shortcuts: { 'icon-btn': 'w-6 h-6 text-gray-500 ' },
});
