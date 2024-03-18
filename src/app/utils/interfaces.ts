import { Stream, VideoClient } from '@zoom/videosdk';

export type MediaStream = typeof Stream;

export type ZoomClient = typeof VideoClient;

export interface ZoomState {
  init: boolean;
  selfId: number;
  meetingInProgress: boolean;
  joinAudio: boolean;
  audio: 'mute' | 'unmute';
  video: 'start' | 'stop';
  participants: ZoomParticipant[];
}

export interface ZoomParticipant {
  /**
   * Identify of a user.
   */
  userId: number;
  /**
   * Display name of a user.
   */
  displayName: string;
  /**
   * Audio state of a user.
   * - `''`: No audio.
   * - `computer`: Joined by computer audio.
   * - `phone`: Joined by phone
   */
  audio: '' | 'computer' | 'phone';
  /**
   * Whether audio is muted.
   */
  muted: boolean;
  /**
   * Whether the user is host.
   */
  isHost: boolean;
  /**
   * Whether the user is manager.
   */
  isManager: boolean;
  /**
   * The avatar of a user.
   * You can set the avatar in the [web profile](https://zoom.us/profile).
   */
  avatar?: string;
  /**
   * Whether the user is started video.
   */
  bVideoOn: boolean;
  /**
   * Whether the user is started share.
   */
  sharerOn: boolean;
  /**
   * Whether the share is paused
   */
  sharePause: boolean;
}
