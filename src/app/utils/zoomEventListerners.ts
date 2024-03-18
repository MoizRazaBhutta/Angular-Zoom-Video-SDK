import { VideoQuality } from '@zoom/videosdk';
import { MediaStream, ZoomClient } from './interfaces';
import { renderParticipantsVideo, zoomState } from './zoomState';

const onUserAddedListener = (zoomClient: ZoomClient, mediaStream: MediaStream) => {
  zoomClient.on('user-added', async (payload) => {
    console.log(`User added`, payload);

    zoomState.participants = zoomClient.getAllUser();

    renderParticipantsVideo(mediaStream);

    console.log(zoomState);
  });
};

const onUserRemovedListener = (zoomClient: ZoomClient, mediaStream: MediaStream) => {
  zoomClient.on('user-removed', (payload) => {
    console.log(`User removed`, payload);

    zoomState.participants = zoomClient.getAllUser();
    renderParticipantsVideo(mediaStream);
  });
};

const onUserUpdatedListener = (
  zoomClient: ZoomClient,
  mediaStream: MediaStream
) => {
  zoomClient.on('user-updated', (payload) => {
    console.log(`User updated`, payload);

    zoomState.participants = zoomClient.getAllUser();
    renderParticipantsVideo(mediaStream);
  });
};

const onPeerVideoStateChangedListener = (
  zoomClient: ZoomClient,
  mediaStream: MediaStream
) => {
  zoomClient.on('peer-video-state-change', async (payload) => {
    console.log('onPeerVideoStateChange', payload);
    const { action, userId } = payload;

    if (
      zoomState.participants.findIndex((user) => user.userId === userId) === -1
    ) {
      console.log('Detected unrecognized participant ID. Ignoring: ', userId);
      return;
    }

    if (action === 'Start') {
      console.log(mediaStream);
      mediaStream.renderVideo(
        document.querySelector('#participants-canvas'),
        payload.userId,
        960,
        540,
        0,
        0,
        VideoQuality.Video_720P
      );
    } else if (action === 'Stop') {
      mediaStream.stopRenderVideo(
        document.querySelector('#participants-canvas'),
        payload.userId
      );
    }
  });
};

const activeSpeakerListener = (zoomClient: ZoomClient) => {
  zoomClient.on('active-speaker', (payload) => {
    console.log('Active speaker', payload);
  });
};

// const onMediaWorkerReadyListener = (zoomClient) => {
//   zoomClient.on('media-sdk-change', (payload) => {
//     const { action, type, result } = payload;
//     if (type === 'audio' && result === 'success') {
//       if (action === 'encode') {
//         state.audioEncode = true;
//       } else if (action === 'decode') {
//         state.audioDecode = true;
//       }
//     }
//   });
// };

export const initClientEventListeners = (
  zoomClient: ZoomClient,
  mediaStream: MediaStream
) => {
  onUserAddedListener(zoomClient, mediaStream);
  onUserRemovedListener(zoomClient, mediaStream);
  onUserUpdatedListener(zoomClient, mediaStream);
  onPeerVideoStateChangedListener(zoomClient, mediaStream);
  activeSpeakerListener(zoomClient);
};
