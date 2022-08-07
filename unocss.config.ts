import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  exclude: ['./node_modules/**/*'],
  presets: [
    presetWind(),
    presetIcons({
      collections: {
        local: {
          terworking:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 4.1708732,4.2072116 2.7042144,7.3111186 H 8.0803372 L 4.3105675,15.933199 H 7.4883271 L 11.258097,7.3111186 h 5.414318 l 1.466657,-3.103907 z M 12.942461,11.380694 7.2663235,23.393456 h 3.0873335 l 2.072705,-4.386716 h 5.433318 l 0.924776,4.386716 h 3.352311 L 20.891732,17.487702 27.6374,11.380694 h -3.282509 l -5.028556,4.552505 h -5.447636 l 2.151096,-4.552505 z m 15.323522,7.626046 -3.250329,7.118695 a 0.85805057,0.84742903 0 0 1 -0.782215,0.499054 H 15.67669 a 0.25588456,0.25271702 0 0 1 -0.239479,-0.341666 l 0.750519,-1.971887 h -3.012474 l -1.385497,3.640306 a 1.2794223,1.2635847 0 0 0 1.19758,1.708213 h 11.130654 a 3.432202,3.3897156 0 0 0 3.128775,-1.996306 L 31.1993,19.00674 Z" fill="currentColor"/></svg>',
        },
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup({
      separators: [':'],
    }),
  ],
  shortcuts: {
    'bg-body': 'bg-white dark:bg-zinc-900',
    'text-body': 'text-black dark:text-white',
  },
})
