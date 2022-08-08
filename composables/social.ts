// @unocss-include

interface Social {
  title: string
  url: string
  icon: string
}

export const useSocial = (): Social[] => [
  {
    title: 'GitHub',
    icon: 'i-iconoir-github',
    url: 'https://github.com/terworking',
  },
  {
    title: 'Instagram',
    icon: 'i-iconoir-instagram',
    url: 'https://instagram.com/terworking',
  },
  {
    title: 'YouTube',
    icon: 'i-iconoir-youtube',
    url: 'https://www.youtube.com/channel/UCdEROl_OTXNyZkYx5rn3AGQ',
  },
]
