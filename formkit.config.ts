// @unocss-include

import { generateClasses } from '@formkit/themes';
import type { DefaultConfigOptions } from '@formkit/vue';

export default {
  config: {
    classes: generateClasses({
      global: {
        inner:
          'border border-gray-400 rounded-lg mb-1 focus-within:border-accent formkit-invalid:border-red',
        input:
          'w-full bg-transparent px-3 h-12 rounded-lg text-body formkit-(placeholder:opacity-50 disabled:opacity-50)',
        label: 'mb-1 font-bold text-sm formkit-disabled:opacity-50',
        message: 'text-red-500 mb-1 text-xs',
        messages: 'list-none p-0 mt-1 mb-0',
        outer: 'mb-5',
      },
    }),
  },
} as DefaultConfigOptions;
