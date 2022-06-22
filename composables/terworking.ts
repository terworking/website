// @unocss-include

import type { Social, Member } from '~~/types/terworking';

const member = [
  { day: 6, month: 5, name: 'Adi Zuliarrahman', year: 2003 },
  { day: 17, month: 12, name: 'Ahmad Yasser', year: 2003 },
  { day: 3, month: 10, name: 'Arief Maulana Mizari', year: 2003 },
  { day: 28, month: 6, name: 'Dimas Purwadhi', year: 2004 },
  { day: 6, month: 3, name: 'Fitriani Kartika', year: 2004 },
  { day: 18, month: 11, name: 'Hirliasari', year: 2004 },
  { day: 13, month: 12, name: 'Humaini', year: 2003 },
  { day: 31, month: 5, name: 'Muhammad Al Amin', year: 2003 },
  { day: 30, month: 6, name: 'Muhammad Fajar Rahmadi', year: 2004 },
  { day: 25, month: 6, name: 'Muhammad Fardan Al Hafiz', year: 2004 },
  { day: 1, month: 7, name: 'Muhammad Fauzan Azimi', year: 2003 },
  { day: 17, month: 12, name: 'Muhammad Fauzil Adhim', year: 2003 },
  {
    day: 15,
    month: 6,
    name: 'Muhammad Hazmi Bassam Azizi Mubarok',
    year: 2004,
  },
  { day: 11, month: 1, name: 'Muhammad Jailani', year: 2003 },
  { day: 15, month: 12, name: 'Muhammad Khairin', year: 2003 },
  { day: 21, month: 8, name: 'Muhammad Nor Abdillah', year: 2004 },
  { day: 13, month: 1, name: 'Muhammad Rahmat', year: 2003 },
  { day: 28, month: 4, name: 'Muhammad Rifqi Hidayat', year: 2004 },
  { day: 30, month: 4, name: 'Muhammad Royan Aqmal', year: 2004 },
  { day: 6, month: 2, name: 'Muhammad Saipurahman', year: 2003 },
  { day: 5, month: 9, name: 'Norlatifah', year: 2004 },
  { day: 15, month: 7, name: 'Norliani', year: 2004 },
  { day: 1, month: 6, name: 'Puji Lestari', year: 2004 },
  { day: 23, month: 11, name: 'Rahmatilah', year: 2003 },
  { day: 7, month: 10, name: 'Rahmayanti', year: 2003 },
  { day: 18, month: 8, name: 'Sahrul Afriza', year: 2002 },
  { day: 9, month: 8, name: 'Wahyu Al Fatah', year: 2002 },
  { day: 23, month: 3, name: 'Yoga Rusydi Arifin', year: 2004 },
] as Member[];

const social = [
  {
    icon: 'i-tabler-brand-github',
    kind: 'GitHub',
    url: 'https://github.com/terworking',
  },
  {
    icon: 'i-tabler-brand-instagram',
    kind: 'Instagram',
    url: 'https://instagram.com/terworking',
  },
  {
    icon: 'i-tabler-brand-youtube',
    kind: 'Youtube',
    url: 'https://www.youtube.com/channel/UCdEROl_OTXNyZkYx5rn3AGQ',
  },
] as Social[];

export const useTerworking = () => ({
  member,
  social,
});
