export type OptionType = 'video_audio' | 'video_only' | 'audio_only';

export interface DownloadOption {
  quality: string;
  size: string;
  format: string;
  type: OptionType;
}

export interface VideoMetadata {
  title: string;
  platform: 'YouTube' | 'Instagram' | 'Unknown';
  thumbnailUrl: string;
  author: string;
  duration?: string;
  options: DownloadOption[];
  sources?: { uri: string; title: string }[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}