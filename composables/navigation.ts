// @unocss-include

interface Navigation {
  title: string
  path: string
  icon: string
}

export const useNavigation = (): Navigation[] => [
  { path: '/home', title: 'Home', icon: 'i-iconoir-home' },
  {
    path: '/members',
    title: 'Member',
    icon: 'i-material-symbols-person-outline',
  },
  { path: '/links', title: 'Link', icon: 'i-iconoir-link' },
  { path: '/about', title: 'About', icon: 'i-iconoir-question-mark' },
]
