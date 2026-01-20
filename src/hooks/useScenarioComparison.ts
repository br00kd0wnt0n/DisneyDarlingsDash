import { useMemo } from 'react';
import type { BudgetTier } from '../data/budgetTiers';
import type { ScenarioPreset } from '../data/scenarioPresets';
import { scenarioPresets } from '../data/scenarioPresets';
import type { ScenarioResult } from '../utils/generateComparison';
import {
  calculateScenarioResults,
  generateComparisonSummary
} from '../utils/generateComparison';

export interface ScenarioComparisonData {
  scenarios: Record<string, ScenarioResult>;
  comparison: string;
  bestScenario: string;
  worstScenario: string;
  presets: Record<string, ScenarioPreset>;
}

export function useScenarioComparison(
  budgetTier: BudgetTier,
  isHoliday: boolean = true
): ScenarioComparisonData {
  return useMemo(() => {
    const scenarios = calculateScenarioResults(budgetTier, isHoliday);
    const comparison = generateComparisonSummary(scenarios, budgetTier);

    // Find best and worst by ROAS
    const sorted = Object.entries(scenarios).sort(
      (a, b) => b[1].roas.mid - a[1].roas.mid
    );

    return {
      scenarios,
      comparison,
      bestScenario: sorted[0][0],
      worstScenario: sorted[sorted.length - 1][0],
      presets: scenarioPresets
    };
  }, [budgetTier, isHoliday]);
}
