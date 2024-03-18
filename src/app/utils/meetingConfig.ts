interface ZoomConfig {
  sdkKey: string;
  sdkSecret: string;
  webEndpoint: string;
  topic: string;
  name: string;
  password: string;
  signature: string;
  sessionKey: string;
  userIdentity: string;
  role: number;
}

export const meetingConfig: ZoomConfig = {
  sdkKey: 'VYoVSCe1B3fBxnulFsJfuYURHMJyFHGfdqti',
  sdkSecret: 'vzkBNeGuFSAyuUkgOamMhYFLRk3lDFQNAroz',
  webEndpoint: 'zoom.us',
  topic: 'OneSchool',
  name: 'Test',
  password: '',
  signature: '',
  sessionKey: '',
  userIdentity: '',
  // role = 1 to join as host, 0 to join as attendee. The first user must join as host to start the session
  role: 1,
};
