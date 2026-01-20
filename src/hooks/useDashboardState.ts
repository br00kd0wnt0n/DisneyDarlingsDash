import { useState, useCallback, useMemo } from 'react';
import type { BudgetTier } from '../data/budgetTiers';
import { budgetTiers } from '../data/budgetTiers';
import { channels } from '../data/channels';
import type { FunnelAssumptions } from '../data/funnelAssumptions';
import { defaultFunnelAssumptions } from '../data/funnelAssumptions';
import { scenarioPresets } from '../data/scenarioPresets';
import type { ChannelMix, ForecastMode } from '../utils/calculations';
import {
  calculateImpressions,
  calculateFunnelStages,
  calculateRevenue,
  calculateROAS,
  calculateCostPerSale,
  calculateBlendedCPM,
  calculateMarketMetrics,
  validateChannelMix
} from '../utils/calculations';

export interface DashboardState {
  selectedTier: BudgetTier;
  channelMix: ChannelMix;
  forecastMode: ForecastMode;
  funnelAssumptions: FunnelAssumptions;
  targetingMode: 'broad' | 'targeted' | 'mixed';
  selectedWave: 'wave1' | 'wave2' | 'all';
  isPresentationMode: boolean;
  showScenarioComparison: boolean;
}

export interface DashboardMetrics {
  impressions: number;
  awareness: number;
  consideration: number;
  intent: number;
  sales: { low: number; high: number; mid: number };
  revenue: { low: number; high: number; mid: number };
  roas: { low: number; high: number; mid: number };
  costPerSale: { low: number; high: number; mid: number };
  blendedCPM: number;
  channelMixValid: boolean;
  channelMixTotal: number;
  channelMixMessage?: string;
  marketMetrics: ReturnType<typeof calculateMarketMetrics>;
}

const getDefaultChannelMix = (): ChannelMix => {
  return channels.reduce((acc, channel) => {
    acc[channel.id] = channel.defaultSplit;
    return acc;
  }, {} as ChannelMix);
};

export function useDashboardState() {
  const [state, setState] = useState<DashboardState>({
    selectedTier: budgetTiers.silver,
    channelMix: getDefaultChannelMix(),
    forecastMode: 'moderate',
    funnelAssumptions: defaultFunnelAssumptions,
    targetingMode: 'targeted',
    selectedWave: 'all',
    isPresentationMode: false,
    showScenarioComparison: false
  });

  // Setters
  const setSelectedTier = useCallback((tier: BudgetTier | string) => {
    const budgetTier = typeof tier === 'string' ? budgetTiers[tier] : tier;
    if (budgetTier) {
      setState(prev => ({ ...prev, selectedTier: budgetTier }));
    }
  }, []);

  const setChannelMix = useCallback((mix: ChannelMix) => {
    setState(prev => ({ ...prev, channelMix: mix }));
  }, []);

  const updateChannelAllocation = useCallback((channelId: string, value: number) => {
    setState(prev => ({
      ...prev,
      channelMix: {
        ...prev.channelMix,
        [channelId]: Math.max(0, Math.min(1, value))
      }
    }));
  }, []);

  const setForecastMode = useCallback((mode: ForecastMode) => {
    setState(prev => ({ ...prev, forecastMode: mode }));
  }, []);

  const setFunnelAssumptions = useCallback((assumptions: FunnelAssumptions) => {
    setState(prev => ({ ...prev, funnelAssumptions: assumptions }));
  }, []);

  const updateFunnelAssumption = useCallback((
    key: keyof Omit<FunnelAssumptions, 'realReactionsBoost'>,
    value: number
  ) => {
    setState(prev => ({
      ...prev,
      funnelAssumptions: {
        ...prev.funnelAssumptions,
        [key]: value
      }
    }));
  }, []);

  const resetFunnelAssumptions = useCallback(() => {
    setState(prev => ({ ...prev, funnelAssumptions: defaultFunnelAssumptions }));
  }, []);

  const setTargetingMode = useCallback((mode: 'broad' | 'targeted' | 'mixed') => {
    setState(prev => ({ ...prev, targetingMode: mode }));
  }, []);

  const setSelectedWave = useCallback((wave: 'wave1' | 'wave2' | 'all') => {
    setState(prev => ({ ...prev, selectedWave: wave }));
  }, []);

  const togglePresentationMode = useCallback(() => {
    setState(prev => ({ ...prev, isPresentationMode: !prev.isPresentationMode }));
  }, []);

  const toggleScenarioComparison = useCallback(() => {
    setState(prev => ({ ...prev, showScenarioComparison: !prev.showScenarioComparison }));
  }, []);

  const applyScenarioPreset = useCallback((scenarioId: string) => {
    const scenario = scenarioPresets[scenarioId];
    if (scenario) {
      setState(prev => ({
        ...prev,
        channelMix: { ...scenario.channelMix },
        showScenarioComparison: false
      }));
    }
  }, []);

  const resetChannelMix = useCallback(() => {
    setState(prev => ({ ...prev, channelMix: getDefaultChannelMix() }));
  }, []);

  // Calculate derived metrics
  const metrics = useMemo((): DashboardMetrics => {
    const { selectedTier, channelMix, funnelAssumptions, targetingMode, selectedWave } = state;

    const isHoliday = selectedWave === 'wave2' || selectedWave === 'all';

    const impressions = calculateImpressions(
      selectedTier.mediaSpend,
      channelMix,
      targetingMode
    );

    const funnelStages = calculateFunnelStages(
      impressions,
      funnelAssumptions,
      isHoliday,
      channelMix
    );

    const revenue = calculateRevenue(funnelStages.sales);
    const roas = calculateROAS(revenue, selectedTier.totalBudget);
    const costPerSale = calculateCostPerSale(selectedTier.totalBudget, funnelStages.sales);
    const blendedCPM = calculateBlendedCPM(channelMix, targetingMode);

    const validation = validateChannelMix(channelMix);

    const marketMetrics = calculateMarketMetrics(
      selectedTier.mediaSpend,
      channelMix,
      funnelAssumptions,
      isHoliday
    );

    return {
      impressions,
      awareness: funnelStages.awareness,
      consideration: funnelStages.consideration,
      intent: funnelStages.intent,
      sales: funnelStages.sales,
      revenue,
      roas,
      costPerSale,
      blendedCPM,
      channelMixValid: validation.isValid,
      channelMixTotal: validation.total,
      channelMixMessage: validation.message,
      marketMetrics
    };
  }, [state]);

  return {
    state,
    metrics,
    setSelectedTier,
    setChannelMix,
    updateChannelAllocation,
    setForecastMode,
    setFunnelAssumptions,
    updateFunnelAssumption,
    resetFunnelAssumptions,
    setTargetingMode,
    setSelectedWave,
    togglePresentationMode,
    toggleScenarioComparison,
    applyScenarioPreset,
    resetChannelMix
  };
}
