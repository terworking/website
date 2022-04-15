import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  shortcuts: {
    'icon-btn': 'w-6 h-6 text-gray-500 ',
  },
  plugins: [require('windicss/plugin/forms')],
});
