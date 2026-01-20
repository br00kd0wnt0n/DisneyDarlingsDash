export interface ScenarioPreset {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  channelMix: Record<string, number>;
  strengths: string[];
  tradeoffs: string[];
  bestFor: string;
}

export const scenarioPresets: Record<string, ScenarioPreset> = {
  awareness: {
    id: "awareness",
    name: "Awareness First",
    icon: "📺",
    tagline: "Build brand recognition before retail push",
    description: "Heavy investment in premium video inventory to establish Disney Darlings as a must-have brand across EU3",
    channelMix: {
      tv: 0.20, ctv: 0.25, youtube: 0.15, meta: 0.15,
      tiktok: 0.10, ooh: 0.10, creators: 0.05, retail: 0.00
    },
    strengths: [
      "Maximizes top-of-funnel reach across EU3",
      "Builds long-term brand equity",
      "Premium inventory reinforces Disney quality association",
      "Strong for market where brand is unknown"
    ],
    tradeoffs: [
      "Higher cost per sale initially",
      "Slower conversion ramp - patience required",
      "Less direct attribution to sales"
    ],
    bestFor: "Markets with low existing Disney awareness or long-lead gift-buying behavior"
  },
  balanced: {
    id: "balanced",
    name: "Balanced Funnel",
    icon: "⚖️",
    tagline: "Full-funnel approach for predictable results",
    description: "Even distribution maintaining presence at every stage from awareness to purchase",
    channelMix: {
      tv: 0.00, ctv: 0.175, youtube: 0.15, meta: 0.15,
      tiktok: 0.10, ooh: 0.20, creators: 0.15, retail: 0.075
    },
    strengths: [
      "Hedges risk across channels",
      "Flexibility to optimize based on early results",
      "Consistent brand presence throughout funnel",
      "Lower variance in outcomes"
    ],
    tradeoffs: [
      "May not maximize any single KPI",
      "Jack of all trades effect",
      "Harder to attribute success to specific tactics"
    ],
    bestFor: "Risk-averse approach or markets with mixed readiness"
  },
  conversion: {
    id: "conversion",
    name: "Retail Conversion",
    icon: "🛒",
    tagline: "Maximize sales efficiency at point of purchase",
    description: "Heavy creator and retail media focus leveraging 'Real Reactions' content strategy",
    channelMix: {
      tv: 0.00, ctv: 0.10, youtube: 0.10, meta: 0.10,
      tiktok: 0.05, ooh: 0.10, creators: 0.30, retail: 0.25
    },
    strengths: [
      "Best cost per sale",
      "Direct attribution to purchases",
      "'Real Reactions' strategy fully amplified",
      "Leverages 'European parents buy on evidence' insight"
    ],
    tradeoffs: [
      "Lower overall reach",
      "Limited brand awareness building",
      "Dependent on retail media inventory availability"
    ],
    bestFor: "Markets with existing Disney awareness, Q4 holiday push"
  }
};

export const scenarioPresetList = Object.values(scenarioPresets);
