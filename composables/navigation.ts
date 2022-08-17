// @unocss-include

interface Navigation {
  title: string
  path: string
  icon: string
}

export const useNavigation = (): Navigation[] => [
  { path: '/', title: 'Home', icon: 'i-iconoir-home' },
  { path: '/', title: 'Member', icon: 'i-material-symbols-person-outline' },
  { path: '/', title: 'Links', icon: 'i-iconoir-link' },
  { path: '/', title: 'About', icon: 'i-iconoir-question-mark' },
]
