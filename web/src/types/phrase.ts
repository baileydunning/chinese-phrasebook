export type PhraseTag = 
  | 'basic'
  | 'polite'
  | 'urgent'
  | 'payment'
  | 'directions'
  | 'questions'
  | 'problems'
  | 'numbers'
  | 'time'
  | 'food-types'
  | 'allergies'
  | 'requests'
  | 'compliments'
  | 'greetings'
  | 'farewells'
  | 'booking'
  | 'bargaining'
  | 'sizing'
  | 'complaints';

export interface Phrase {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  category: SituationCategory;
  politeness?: 'casual' | 'polite' | 'very-polite';
  culturalNote?: string;
  audioUrl?: string;
  isSaved?: boolean;
  isEmergency?: boolean;
  // Taiwan variant (only if different from mainland)
  taiwanChinese?: string;
  taiwanPinyin?: string;
  // Hidden tags for filtering
  tags?: PhraseTag[];
}

export type SituationCategory = 
  | 'food' 
  | 'transport' 
  | 'hotel' 
  | 'shopping' 
  | 'emergency' 
  | 'social' 
  | 'dating'
  | 'weather'
  | 'nature'
  | 'tech'
  | 'facilities'
  | 'attractions'
  | 'custom';

export interface Situation {
  id: SituationCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  phrases: Phrase[];
}

export interface SavedPhrase extends Phrase {
  savedAt: Date;
  note?: string;
  isFavorite?: boolean;
  usageCount?: number;
  lastUsed?: Date;
}

export interface BasicWord {
  chinese: string;
  pinyin: string;
  english: string;
  category: string;
}

export interface SavedWord extends BasicWord {
  id: string;
  savedAt: Date;
  type: 'word';
}
