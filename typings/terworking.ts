export interface Member {
  day: number;
  month: number;
  name: string;
  year: number;
}

type SocialKind = 'GitHub' | 'Instagram' | 'Youtube';

export interface Social {
  icon: string;
  kind: SocialKind;
  url: string;
}
