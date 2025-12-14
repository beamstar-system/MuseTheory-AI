export interface Note {
  name: string; // e.g., "C", "F#"
  octave?: number;
  color?: string; // For highlighting intervals
}

export interface VisualizationData {
  title: string;
  description: string;
  type: 'scale' | 'chord' | 'interval';
  root: string;
  notes: string[]; // List of note names to highlight
  intervals: string[]; // e.g., ["R", "3", "5"]
  instrumentPreference?: 'piano' | 'guitar';
}

export enum AppMode {
  THEORY = 'theory',
  CHAT = 'chat',
  IMAGE = 'image',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ImageConfig {
  size: '1K' | '2K' | '4K';
}
