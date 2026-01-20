export interface Channel {
  id: string;
  name: string;
  cpmBroad: number | null;
  cpmTargeted: number;
  defaultSplit: number;
  goldSplit?: number;
  vtr: number;
  conversionIndex: number;
  description: string;
}

export const channels: Channel[] = [
  {
    id: "tv",
    name: "TV",
    cpmBroad: null,
    cpmTargeted: 155.25,
    defaultSplit: 0.00,
    goldSplit: 0.25,
    vtr: 0.85,
    conversionIndex: 1.2,
    description: "Linear TV (limited in Bronze)"
  },
  {
    id: "ctv",
    name: "CTV",
    cpmBroad: null,
    cpmTargeted: 47.25,
    defaultSplit: 0.175,
    vtr: 0.90,
    conversionIndex: 1.4,
    description: "Connected TV (Disney+, Netflix, YouTube TV)"
  },
  {
    id: "youtube",
    name: "YouTube",
    cpmBroad: 4.05,
    cpmTargeted: 11.475,
    defaultSplit: 0.15,
    vtr: 0.65,
    conversionIndex: 1.1,
    description: "YouTube pre-roll and in-stream"
  },
  {
    id: "meta",
    name: "Meta (IG/FB)",
    cpmBroad: 2.025,
    cpmTargeted: 6.75,
    defaultSplit: 0.15,
    vtr: 0.55,
    conversionIndex: 1.0,
    description: "Instagram and Facebook ads"
  },
  {
    id: "tiktok",
    name: "TikTok",
    cpmBroad: 2.025,
    cpmTargeted: 6.75,
    defaultSplit: 0.10,
    vtr: 0.45,
    conversionIndex: 0.9,
    description: "TikTok native video ads"
  },
  {
    id: "ooh",
    name: "OOH/DOOH",
    cpmBroad: 13.50,
    cpmTargeted: 16.875,
    defaultSplit: 0.20,
    vtr: 0.70,
    conversionIndex: 1.3,
    description: "Out of home and digital billboards"
  },
  {
    id: "creators",
    name: "Creators",
    cpmBroad: 13.50,
    cpmTargeted: 40.50,
    defaultSplit: 0.15,
    vtr: 0.75,
    conversionIndex: 1.5,
    description: "Influencer partnerships"
  },
  {
    id: "retail",
    name: "Retail DSP",
    cpmBroad: 5.40,
    cpmTargeted: 6.75,
    defaultSplit: 0.075,
    vtr: 0.80,
    conversionIndex: 1.8,
    description: "Amazon DSP and retail media"
  }
];

export type ChannelId = typeof channels[number]['id'];

export const channelMap = channels.reduce((acc, channel) => {
  acc[channel.id] = channel;
  return acc;
}, {} as Record<string, Channel>);
