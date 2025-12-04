export interface ScriptData {
  text: string;
  voice: string;
}

export enum AvatarState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR'
}
