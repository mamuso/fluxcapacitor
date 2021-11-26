export type Config = {
  date: string;
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
