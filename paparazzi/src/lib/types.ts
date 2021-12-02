export type Config = {
  date: string;
  basePath: string;
  tmpPath: string;
  tmpDatePath: string;
  tmpCurrentPath: string;
  format: string;
  minify: boolean;
  compare: boolean;
  storage: string;
  devices: [Device];
  endpoints: [Endpoint];
  auth: [Auth];
};

export type Auth = {
  url: string;
  username: string;
  password: string;
  submit: string;
  cookie: boolean;
};

export type Device = {
  id: string;
  slug: string;
  name: string;
  device: string;
  userAgent: string;
  deviceScaleFactor: number;
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
  };
};

export type Endpoint = {
  id: string;
  slug: string;
  url: string;
  captures: [CaptureType];
  reports: [Report];
  reportcount: number;
  startsAt: string;
  endsAt: string;
  auth: boolean;
};

export type CaptureType = {
  id: string;
  slug: string;
  deviceScaleFactor: number;
  url: string;
  urlmin: string;
  urldiff: string;
  diff: boolean;
  diffindex: number;
  endpoint: Endpoint;
  endpointId: string;
  report: Report;
  reportId: string;
  device: Device;
  devideId: string;
};

export type Report = {
  id: string;
  slug: string;
  current: boolean;
  endpoints: [Endpoint];
  count: number;
  captures: [CaptureType];
};
