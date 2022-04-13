import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  shortcuts: {
    'icon-btn': 'w-6 h-6 text-gray-500 ',
    // 'countdown-item': 'flex flex-col divide-y p-4 rounded-2xl',
  },
  plugins: [require('windicss/plugin/forms')],
});
