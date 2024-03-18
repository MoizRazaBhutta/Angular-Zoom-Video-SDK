import { Component, OnInit } from '@angular/core';
import ZoomVideo from '@zoom/videosdk';
import { generateSignature } from './utils/generateMeetingToken';
import { MediaStream, ZoomClient } from './utils/interfaces';
import { meetingConfig } from './utils/meetingConfig';
import { initClientEventListeners } from './utils/zoomEventListerners';
import {
  initialZoomState,
  positionCoordinates,
  zoomState
} from './utils/zoomState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'zoom';

  // Zoom
  zoomState = zoomState;
  positionCoordinates = positionCoordinates;
  client: ZoomClient = ZoomVideo.createClient();
  stream: MediaStream;
  createMeeting;

  ngOnInit() {
    const { sdkKey, sdkSecret, topic, role, sessionKey, name, password } =
      meetingConfig;

    let token = generateSignature(
      sdkKey,
      sdkSecret,
      topic,
      role,
      sessionKey,
      name
    );

    this.createMeeting = {
      topic,
      token,
      name,
      password,
    };

    console.log(this.createMeeting);
  }

  async startMeeting({ topic, token, name, password }) {
    await this.client.init('en-Us', 'CDN', {
      enforceMultipleVideos: true,
      stayAwake: true
    });

    await this.client
      .join(topic, token, name, password)
      .then(() => {
        this.stream = this.client.getMediaStream();
        initClientEventListeners(this.client, this.stream);
        zoomState.init = true;
        zoomState.meetingInProgress = true;
        zoomState.selfId = this.client.getSessionInfo().userId;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async leaveMeeting() {
    // for attendees i.e Students, role 0
    await this.client.leave();
    this.zoomState = initialZoomState;
  }

  async endMeeting() {
    // for host only i.e Teacher, role 1
    await this.client.leave(true);
    this.zoomState = initialZoomState;
  }

  async startVideo() {
    if (!!window['chrome'] && !(typeof SharedArrayBuffer === 'function')) {
      // if desktop Chrome or Edge (Chromium) with SharedArrayBuffer not enabled
      await this.stream.startVideo({
        videoElement: document.querySelector('#self-view-video'),
      });

      zoomState.video = 'start';
      console.log(zoomState);
    } else {
      // all other browsers and desktop Chrome or Edge (Chromium) with SharedArrayBuffer enabled
      // @ts-expect-error
      await this.stream.startVideo(() => {
        this.stream.renderVideo(
          document.querySelector('#self-view-canvas'),
          this.client.getCurrentUserInfo().userId,
          1920,
          1080,
          0,
          0,
          3
        );
      });

      zoomState.video = 'start';
      console.log(zoomState);
    }
  }

  async stopVideo() {
    await this.stream.stopVideo();
    zoomState.video = 'stop';
    console.log(zoomState);
  }

  audioDecode;
  audioEncode;

  audioEventListener() {
    // event listener to see when desktop Safari audio has been initialized
    this.client.on('media-sdk-change', (payload) => {
      if (payload.type === 'audio' && payload.result === 'success') {
        if (payload.action === 'encode') {
          // encode for sending audio stream (speak)
          this.audioEncode = true;
        } else if (payload.action === 'decode') {
          // decode for receiving audio stream (hear)
          this.audioDecode = true;
        }
      }
    });
  }

  async joinAudio() {
    // if desktop Safari https://stackoverflow.com/a/42189492/6592510
    var isSafari = window['safari'] !== undefined;

    if (isSafari) {
      // desktop Safari, check if desktop Safari audio has been initialized
      if (this.audioEncode && this.audioDecode) {
        // desktop Safari audio has been initialized, continue to start audio
        await this.stream.startAudio();
        await this.stream.muteAudio();
        zoomState.joinAudio = true;
        zoomState.audio = 'mute';
        console.log(zoomState);
      } else {
        // desktop Safari audio has not been initialized, retry or handle error
        console.log('safari audio has not finished initializing');
      }
    } else {
      // not desktop Safari, continue to start audio
      await this.stream.startAudio();
      await this.stream.muteAudio();
      zoomState.joinAudio = true;
      zoomState.audio = 'mute';
      console.log(zoomState);
    }
  }

  toggleAudioState() {
    zoomState.audio === 'mute' ? this.unmuteAudio() : this.muteAudio();
  }

  async muteAudio() {
    await this.stream.muteAudio();
    zoomState.audio = 'mute';
    console.log(zoomState);
  }

  async unmuteAudio() {
    await this.stream.unmuteAudio();
    zoomState.audio = 'unmute';
    console.log(zoomState);
  }

  // for host
  async askParticipantToUnmute(userId) {
    await this.stream.unmuteAudio(userId);
  }
}
