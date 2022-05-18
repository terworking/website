export interface Member {
  name: string
  day: number
  month: number
  year: number
}

type SocialKind = 'GitHub' | 'Instagram' | 'Youtube'

export interface Social {
  kind: SocialKind
  url: string
  icon: string
}
