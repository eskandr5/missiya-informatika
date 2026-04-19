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
  | 'final_mixed'
  | 'media_classification'
  | 'media_format_selection'
  | 'media_property_check'
  | 'media_kit_assembly'
  | 'binary_lock'
  | 'number_mission';

export type MissionStageType = 'mission' | 'checkpoint';

export interface ModuleVariety {
  moduleIdentity: string;
  openingStyle: string;
  rewardType: string;
  videoMode: string;
  chapter: string;
  moduleFeel: string;
  specialMechanic: string;
}

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

export interface ProgressionStageBase {
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

export interface Mission extends ProgressionStageBase {
  stageType?: 'mission';
}

export interface Checkpoint extends ProgressionStageBase {
  stageType: 'checkpoint';
  afterModuleId: number;
  beforeModuleId: number;
}

export type ProgressionStage = Mission | Checkpoint;

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  accent: string;
  xpReward: number;
  badge: BadgeDef;
  moduleIdentity?: string;
  openingStyle?: string;
  rewardType?: string;
  videoMode?: string;
  chapter?: string;
  moduleFeel?: string;
  specialMechanic?: string;
  vocab: VocabWord[];
  phrases: Phrase[];
  missions: Mission[];
}
