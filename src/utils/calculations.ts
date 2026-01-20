import { channels } from '../data/channels';
import type { Market } from '../data/markets';
import { markets } from '../data/markets';
import type { FunnelAssumptions } from '../data/funnelAssumptions';
import { defaultFunnelAssumptions } from '../data/funnelAssumptions';

export type ChannelMix = Record<string, number>;
export type ForecastMode = "conservative" | "moderate" | "aggressive";

export interface SalesRange {
  low: number;
  high: number;
  mid: number;
}

export interface RevenueRange {
  low: number;
  high: number;
  mid: number;
}

export interface ROASRange {
  low: number;
  high: number;
  mid: number;
}

export interface FunnelStages {
  impressions: number;
  awareness: number;
  consideration: number;
  intent: number;
  sales: SalesRange;
}

export const forecastModeMultipliers: Record<ForecastMode, number> = {
  conservative: 0.8,
  moderate: 1.0,
  aggressive: 1.2
};

export const forecastModeLabels: Record<ForecastMode, { label: string; description: string }> = {
  conservative: {
    label: "Conservative",
    description: "Assumes lower conversion rates and higher costs - use for risk planning"
  },
  moderate: {
    label: "Moderate",
    description: "Baseline assumptions based on industry benchmarks"
  },
  aggressive: {
    label: "Optimistic",
    description: "Assumes strong performance and efficient execution"
  }
};

export function calculateImpressions(
  mediaSpend: number,
  channelMix: ChannelMix,
  targetingMode: "broad" | "targeted" | "mixed" = "targeted"
): number {
  let totalImpressions = 0;

  for (const channel of channels) {
    const allocation = channelMix[channel.id] || 0;
    const channelSpend = mediaSpend * allocation;

    const cpm = targetingMode === "broad" && channel.cpmBroad
      ? channel.cpmBroad
      : channel.cpmTargeted;

    if (cpm && channelSpend > 0) {
      const impressions = (channelSpend / cpm) * 1000;
      totalImpressions += impressions;
    }
  }

  return totalImpressions;
}

export function calculateWeightedConversionIndex(
  channelMix: ChannelMix
): number {
  let weightedIndex = 0;
  let totalWeight = 0;

  for (const channel of channels) {
    const allocation = channelMix[channel.id] || 0;
    if (allocation > 0) {
      weightedIndex += channel.conversionIndex * allocation;
      totalWeight += allocation;
    }
  }

  return totalWeight > 0 ? weightedIndex / totalWeight : 1;
}

export function calculateBlendedCPM(
  channelMix: ChannelMix,
  targetingMode: "broad" | "targeted" | "mixed" = "targeted"
): number {
  let totalSpendWeight = 0;
  let weightedCPM = 0;

  for (const channel of channels) {
    const allocation = channelMix[channel.id] || 0;
    if (allocation > 0) {
      const cpm = targetingMode === "broad" && channel.cpmBroad
        ? channel.cpmBroad
        : channel.cpmTargeted;
      if (cpm) {
        weightedCPM += cpm * allocation;
        totalSpendWeight += allocation;
      }
    }
  }

  return totalSpendWeight > 0 ? weightedCPM / totalSpendWeight : 0;
}

export function calculateFunnelStages(
  impressions: number,
  funnel: FunnelAssumptions = defaultFunnelAssumptions,
  isHoliday: boolean = false,
  channelMix?: ChannelMix
): FunnelStages {
  const conversionBoost = channelMix ? calculateWeightedConversionIndex(channelMix) : 1;

  const awareness = impressions * funnel.impressionsToAwareness;
  const consideration = awareness * funnel.awarenessToConsideration * funnel.realReactionsBoost.consideration;
  const intent = consideration * funnel.considerationToIntent * funnel.realReactionsBoost.trust;
  let baseSales = intent * funnel.intentToPurchase * funnel.realReactionsBoost.posConversion * conversionBoost;

  if (isHoliday) {
    baseSales *= funnel.q4Multiplier;
  }

  const low = Math.floor(baseSales * forecastModeMultipliers.conservative);
  const high = Math.ceil(baseSales * forecastModeMultipliers.aggressive);
  const mid = Math.floor((low + high) / 2);

  return {
    impressions,
    awareness,
    consideration,
    intent,
    sales: { low, high, mid }
  };
}

export function calculateSalesProjection(
  impressions: number,
  funnel: FunnelAssumptions = defaultFunnelAssumptions,
  isHoliday: boolean = false,
  mode: ForecastMode = "moderate",
  channelMix?: ChannelMix
): SalesRange {
  const stages = calculateFunnelStages(impressions, funnel, isHoliday, channelMix);
  const modeMultiplier = forecastModeMultipliers[mode];

  return {
    low: Math.floor(stages.sales.low * (mode === "conservative" ? 1 : modeMultiplier / forecastModeMultipliers.conservative)),
    high: Math.ceil(stages.sales.high * (mode === "aggressive" ? 1 : modeMultiplier / forecastModeMultipliers.aggressive)),
    mid: Math.floor(stages.sales.mid * modeMultiplier)
  };
}

export function calculateRevenue(
  sales: SalesRange,
  marketData: Record<string, Market> = markets
): RevenueRange {
  const avgPrice = Object.values(marketData).reduce((acc, market) => {
    return acc + (market.avgDollPrice * market.budgetSplit);
  }, 0);

  return {
    low: sales.low * avgPrice,
    high: sales.high * avgPrice,
    mid: sales.mid * avgPrice
  };
}

export function calculateWeightedAvgPrice(
  marketData: Record<string, Market> = markets
): number {
  return Object.values(marketData).reduce((acc, market) => {
    return acc + (market.avgDollPrice * market.budgetSplit);
  }, 0);
}

export function calculateROAS(
  revenue: RevenueRange,
  totalBudget: number
): ROASRange {
  return {
    low: revenue.low / totalBudget,
    high: revenue.high / totalBudget,
    mid: revenue.mid / totalBudget
  };
}

export function calculateCostPerSale(
  totalBudget: number,
  sales: SalesRange
): { low: number; high: number; mid: number } {
  return {
    low: totalBudget / sales.high,
    high: totalBudget / sales.low,
    mid: totalBudget / sales.mid
  };
}

export function calculateMarketMetrics(
  totalMediaSpend: number,
  channelMix: ChannelMix,
  funnel: FunnelAssumptions = defaultFunnelAssumptions,
  isHoliday: boolean = false
) {
  return Object.entries(markets).map(([, market]) => {
    const marketSpend = totalMediaSpend * market.budgetSplit;
    const impressions = calculateImpressions(marketSpend, channelMix);
    const stages = calculateFunnelStages(impressions, funnel, isHoliday, channelMix);

    return {
      ...market,
      spend: marketSpend,
      impressions,
      sales: stages.sales,
      revenue: {
        low: stages.sales.low * market.avgDollPrice,
        high: stages.sales.high * market.avgDollPrice,
        mid: stages.sales.mid * market.avgDollPrice
      }
    };
  });
}

export function validateChannelMix(channelMix: ChannelMix): {
  isValid: boolean;
  total: number;
  message?: string;
} {
  const total = Object.values(channelMix).reduce((sum, val) => sum + val, 0);
  const roundedTotal = Math.round(total * 100) / 100;

  if (roundedTotal < 0.99) {
    return {
      isValid: false,
      total: roundedTotal,
      message: `Channel mix totals ${(roundedTotal * 100).toFixed(0)}% - needs ${((1 - roundedTotal) * 100).toFixed(0)}% more`
    };
  }

  if (roundedTotal > 1.01) {
    return {
      isValid: false,
      total: roundedTotal,
      message: `Channel mix totals ${(roundedTotal * 100).toFixed(0)}% - reduce by ${((roundedTotal - 1) * 100).toFixed(0)}%`
    };
  }

  return { isValid: true, total: roundedTotal };
}
