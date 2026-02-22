export type WorkflowStep =
  | "script"
  | "visual"
  | "consistency"
  | "timeline"
  | "multimodal";

export interface WorkflowStepInfo {
  id: WorkflowStep;
  label: string;
  shortLabel: string;
  description: string;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  narration: string;
  duration: number;
  shotType: ShotType;
  visualKeywords: string[];
  thumbnailColor: string;
}

export type ShotType =
  | "wide"
  | "medium"
  | "closeup"
  | "aerial"
  | "macro"
  | "panning"
  | "tracking";

export interface VisualAnchor {
  id: string;
  type: "character" | "scene" | "element";
  name: string;
  description: string;
  color: string;
  consistencyScore: number;
  appearances: number;
}

export interface TimelineTrack {
  id: string;
  type: "video" | "voiceover" | "music" | "subtitle";
  label: string;
  clips: TimelineClip[];
}

export interface TimelineClip {
  id: string;
  label: string;
  startTime: number;
  duration: number;
  color: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  style: string;
  language: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  duration: number;
  mood: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  category: string;
  duration: number;
}
