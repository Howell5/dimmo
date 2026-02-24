// === Workspace ===

export type WorkspaceTab = "script" | "visual" | "arrange";

export interface WorkspaceTabInfo {
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
  description: string;
}

// === Asset System ===

export type AssetType = "character" | "location" | "prop" | "style";

export interface ReferenceImage {
  id: string;
  url: string;
  caption: string;
  isPrimary: boolean;
}

interface AssetBase {
  id: string;
  type: AssetType;
  name: string;
  description: string;
  color: string;
  tags: string[];
  referenceImages: ReferenceImage[];
  consistencyScore: number;
  createdAt: number;
}

export interface CharacterAsset extends AssetBase {
  type: "character";
  appearance: string;
  costume: string;
}

export interface LocationAsset extends AssetBase {
  type: "location";
  atmosphere: string;
  lighting: string;
}

export interface PropAsset extends AssetBase {
  type: "prop";
  visualTraits: string;
  scale: string;
}

export interface StyleGuideAsset extends AssetBase {
  type: "style";
  artStyle: string;
  colorScheme: string[];
  rules: string[];
}

export type Asset =
  | CharacterAsset
  | LocationAsset
  | PropAsset
  | StyleGuideAsset;

// === Asset Reference (links asset to shot) ===

export interface AssetRef {
  assetId: string;
  assetType: AssetType;
  role: string;
}

// === Shot (formerly Scene) ===

export type ShotType =
  | "wide"
  | "medium"
  | "closeup"
  | "aerial"
  | "macro"
  | "panning"
  | "tracking";

export type CameraMovement =
  | "static"
  | "pan-left"
  | "pan-right"
  | "tilt-up"
  | "tilt-down"
  | "dolly-in"
  | "dolly-out"
  | "crane-up"
  | "crane-down"
  | "orbit";

export interface Shot {
  id: string;
  order: number;
  title: string;
  narration: string;
  duration: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  visualKeywords: string[];
  visualNotes: string;
  thumbnailColor: string;
  assetRefs: AssetRef[];
}

// === Consistency ===

export type ConsistencyIssueSeverity = "error" | "warning" | "info";

export interface ConsistencyIssue {
  id: string;
  severity: ConsistencyIssueSeverity;
  message: string;
  shotId?: string;
  assetId?: string;
}

export interface ConsistencyReport {
  overallScore: number;
  issues: ConsistencyIssue[];
  checkedAt: number;
}

// === Timeline ===

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

// === Audio ===

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

