import { VideoQuality } from '@zoom/videosdk';
import { sampleParticipants } from './emulateMeetingParticipants';
import { MediaStream, ZoomState } from './interfaces';

export const zoomState: ZoomState = {
  init: false,
  selfId: undefined,
  meetingInProgress: false,
  joinAudio: false,
  audio: 'mute',
  video: 'stop',
  participants: [],
};

export const initialZoomState = {
  ...zoomState,
};

// Render 4 video streams at a time on a single canvas at the listed coordinates
// Implement pagination to iterate and view 4 video streams at a time
export const canvasCoordinates = [
  // {
  //   x: 0,
  //   y: 540,
  // },
  {
    x: 960,
    y: 540,
  },
  {
    x: 0,
    y: 0,
  },
  {
    x: 960,
    y: 0,
  },
];

export const positionCoordinates = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 0,
    y: 960,
  },
  {
    x: 540,
    y: 0,
  },
  {
    x: 540,
    y: 960,
  },
];

export function renderParticipantsVideo(stream: MediaStream) {
  const participantVideo = zoomState.participants
    .filter((user) => user.bVideoOn)
    .filter((user) => user.userId !== zoomState.selfId)
    .slice(0, 3);

  console.log(participantVideo);

  participantVideo.map(async (user, index) => {
    await stream.renderVideo(
      document.querySelector('#participants-canvas'),
      user.userId,
      960,
      540,
      canvasCoordinates[index].x,
      canvasCoordinates[index].y,
      VideoQuality.Video_720P
    );
  });
}
