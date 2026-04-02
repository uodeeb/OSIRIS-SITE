export type CharacterId =
  | 'narrator'
  | 'yahya'
  | 'laila'
  | 'tarek'
  | 'osiris'
  | 'firstEngineer'
  | 'samaritan'
  | 'constantine'
  | 'arius'
  | 'athanasius'
  | 'abuAbdullah'
  | 'aisha'
  | 'hitler'
  | 'stalin'
  | 'polPot'
  | 'hussein';

export interface Character {
  id: CharacterId;
  nameAr: string;
  nameEn: string;
  color: string;
  align: 'right' | 'left' | 'center';
  portrait: string;
}

export const CHARACTERS: Record<CharacterId, Character> = {
  narrator: {
    id: 'narrator',
    nameAr: 'الراوي',
    nameEn: 'Narrator',
    color: '#888888',
    align: 'center',
    portrait: '',
  },
  yahya: {
    id: 'yahya',
    nameAr: 'يحيى',
    nameEn: 'Yahya',
    color: '#3b82f6',
    align: 'right',
    portrait: '/assets/character/yahya-portrait.png',
  },
  laila: {
    id: 'laila',
    nameAr: 'ليلى',
    nameEn: 'Laila',
    color: '#22c55e',
    align: 'right',
    portrait: '/assets/character/laila-portrait.png',
  },
  tarek: {
    id: 'tarek',
    nameAr: 'طارق',
    nameEn: 'Tarek',
    color: '#c9a96e',
    align: 'right',
    portrait: '/assets/character/tarek-portrait.png',
  },
  osiris: {
    id: 'osiris',
    nameAr: 'أوزيريس',
    nameEn: 'OSIRIS',
    color: '#c9a96e',
    align: 'center',
    portrait: '',
  },
  firstEngineer: {
    id: 'firstEngineer',
    nameAr: 'المهندس الأول',
    nameEn: 'First Engineer',
    color: '#6b21a8',
    align: 'left',
    portrait: '/assets/character/first-engineer-portrait.png',
  },
  samaritan: {
    id: 'samaritan',
    nameAr: 'السامري',
    nameEn: 'Samaritan',
    color: '#c9a96e',
    align: 'left',
    portrait: '/assets/character/samaritan-portrait.png',
  },
  constantine: {
    id: 'constantine',
    nameAr: 'قسطنطين',
    nameEn: 'Constantine',
    color: '#1e3a8a',
    align: 'left',
    portrait: '/assets/character/constantine-portrait.png',
  },
  arius: {
    id: 'arius',
    nameAr: 'آريوس',
    nameEn: 'Arius',
    color: '#888888',
    align: 'right',
    portrait: '/assets/character/arius-portrait.png',
  },
  athanasius: {
    id: 'athanasius',
    nameAr: 'أثناسيوس',
    nameEn: 'Athanasius',
    color: '#888888',
    align: 'left',
    portrait: '/assets/character/athanasius-portrait.png',
  },
  abuAbdullah: {
    id: 'abuAbdullah',
    nameAr: 'أبو عبد الله',
    nameEn: 'Abu Abdullah',
    color: '#888888',
    align: 'center',
    portrait: '',
  },
  aisha: {
    id: 'aisha',
    nameAr: 'عائشة الحرة',
    nameEn: 'Aisha al-Hurra',
    color: '#888888',
    align: 'center',
    portrait: '',
  },
  hitler: {
    id: 'hitler',
    nameAr: 'هتلر',
    nameEn: 'Hitler',
    color: '#dc2626',
    align: 'left',
    portrait: '',
  },
  stalin: {
    id: 'stalin',
    nameAr: 'ستالين',
    nameEn: 'Stalin',
    color: '#dc2626',
    align: 'left',
    portrait: '',
  },
  polPot: {
    id: 'polPot',
    nameAr: 'بول بوت',
    nameEn: 'Pol Pot',
    color: '#dc2626',
    align: 'left',
    portrait: '',
  },
  hussein: {
    id: 'hussein',
    nameAr: 'الحسين',
    nameEn: 'Hussein',
    color: '#22c55e',
    align: 'center',
    portrait: '',
  },
};

export const CHARACTER_COLORS: Record<CharacterId, string> = {
  narrator: '#888888',
  yahya: '#3b82f6',
  laila: '#22c55e',
  tarek: '#c9a96e',
  osiris: '#c9a96e',
  firstEngineer: '#6b21a8',
  samaritan: '#c9a96e',
  constantine: '#1e3a8a',
  arius: '#888888',
  athanasius: '#888888',
  abuAbdullah: '#888888',
  aisha: '#888888',
  hitler: '#dc2626',
  stalin: '#dc2626',
  polPot: '#dc2626',
  hussein: '#22c55e',
};
