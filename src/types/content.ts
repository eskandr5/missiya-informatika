import type { ActivityData } from './activity';

export type MissionType =
  | 'matching'
  | 'sequence'
  | 'multiple_choice'
  | 'phrase_ordering'
  | 'phrase_choice'
  | 'listen_and_choose'
  | 'listen_and_match'
  | 'drag_drop'
  | 'classification'
  | 'error_correction'
  | 'audio_quiz'
  | 'video_quiz'
  | 'logic_table'
  | 'final_mixed';

export interface VocabWord {
  id: string;
  ru: string;
  en: string;
  def: string;
}

export interface Phrase {
  ru: string;
  en: string;
}

export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
}

export interface Mission {
  id: string;
  num: number;
  title: string;
  type: MissionType;
  xpReward: number;
  passingScore: number;
  implemented: boolean;
  briefing: string;
  vocabSlice: [number, number];
  activityData: ActivityData | null;
  videoUrl?: string | null;
}

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  accent: string;
  xpReward: number;
  badge: BadgeDef;
  vocab: VocabWord[];
  phrases: Phrase[];
  missions: Mission[];
}
