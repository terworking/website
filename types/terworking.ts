export interface Member {
  name: string;
  avatar: string;
  instagram?: string;
  quote?: string;
}

export interface MemberBirthday {
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
