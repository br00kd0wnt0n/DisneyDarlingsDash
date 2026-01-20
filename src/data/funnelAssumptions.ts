export interface FunnelAssumptions {
  impressionsToAwareness: number;
  awarenessToConsideration: number;
  considerationToIntent: number;
  intentToPurchase: number;
  realReactionsBoost: {
    consideration: number;
    trust: number;
    posConversion: number;
  };
  q4Multiplier: number;
}

export const defaultFunnelAssumptions: FunnelAssumptions = {
  impressionsToAwareness: 0.15,
  awarenessToConsideration: 0.50,
  considerationToIntent: 0.35,
  intentToPurchase: 0.25,
  realReactionsBoost: {
    consideration: 1.25,
    trust: 1.35,
    posConversion: 1.20
  },
  q4Multiplier: 1.4
};

export const funnelStageRanges = {
  impressionsToAwareness: { min: 0.05, max: 0.30, step: 0.01 },
  awarenessToConsideration: { min: 0.30, max: 0.70, step: 0.01 },
  considerationToIntent: { min: 0.20, max: 0.50, step: 0.01 },
  intentToPurchase: { min: 0.10, max: 0.40, step: 0.01 },
  q4Multiplier: { min: 1.0, max: 2.0, step: 0.1 },
};

export const funnelStageLabels: Record<string, string> = {
  impressionsToAwareness: "Impressions → Awareness",
  awarenessToConsideration: "Awareness → Consideration",
  considerationToIntent: "Consideration → Intent",
  intentToPurchase: "Intent → Purchase",
  q4Multiplier: "Q4 Holiday Multiplier",
};
