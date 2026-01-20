import { scenarioPresets } from '../data/scenarioPresets';
import type { BudgetTier } from '../data/budgetTiers';
import type { SalesRange, ROASRange } from './calculations';
import { calculateImpressions, calculateFunnelStages, calculateROAS, calculateRevenue } from './calculations';
import { defaultFunnelAssumptions } from '../data/funnelAssumptions';

export interface ScenarioResult {
  id: string;
  name: string;
  icon: string;
  impressions: number;
  sales: SalesRange;
  revenue: { low: number; high: number; mid: number };
  roas: ROASRange;
  costPerSale: { low: number; high: number; mid: number };
  bestFor: string;
}

export function calculateScenarioResults(
  budgetTier: BudgetTier,
  isHoliday: boolean = true
): Record<string, ScenarioResult> {
  const results: Record<string, ScenarioResult> = {};

  for (const [key, scenario] of Object.entries(scenarioPresets)) {
    const impressions = calculateImpressions(budgetTier.mediaSpend, scenario.channelMix);
    const funnelStages = calculateFunnelStages(
      impressions,
      defaultFunnelAssumptions,
      isHoliday,
      scenario.channelMix
    );
    const revenue = calculateRevenue(funnelStages.sales);
    const roas = calculateROAS(revenue, budgetTier.totalBudget);

    results[key] = {
      id: key,
      name: scenario.name,
      icon: scenario.icon,
      impressions,
      sales: funnelStages.sales,
      revenue,
      roas,
      costPerSale: {
        low: budgetTier.totalBudget / funnelStages.sales.high,
        high: budgetTier.totalBudget / funnelStages.sales.low,
        mid: budgetTier.totalBudget / funnelStages.sales.mid
      },
      bestFor: scenario.bestFor
    };
  }

  return results;
}

export function generateComparisonSummary(
  scenarios: Record<string, ScenarioResult>,
  _budgetTier: BudgetTier
): string {
  const results = Object.entries(scenarios)
    .map(([key, result]) => ({
      key,
      ...result
    }))
    .sort((a, b) => b.roas.mid - a.roas.mid);

  const best = results[0];
  const worst = results[results.length - 1];
  const middle = results[1];

  const impressionsDiff = ((worst.impressions - best.impressions) / best.impressions * 100).toFixed(0);
  const costDiff = ((worst.costPerSale.mid - best.costPerSale.mid) / best.costPerSale.mid * 100).toFixed(0);

  return `${best.name} yields ${costDiff}% lower cost per sale but ${impressionsDiff}% fewer total impressions than ${worst.name}. ${middle.name} sits between, optimizing for ${middle.bestFor.split(' ')[0].toLowerCase()} performance. Given the "Real Reactions" content strategy and European parent behavior, ${best.name} aligns with the brief's emphasis on building purchase confidence through proof.`;
}

export function generateScenarioRecommendation(
  scenarios: Record<string, ScenarioResult>,
  priorities: {
    reachImportance: number; // 0-1
    roasImportance: number; // 0-1
    riskTolerance: number; // 0-1, higher = more aggressive
  }
): { recommended: string; rationale: string } {
  const { reachImportance, roasImportance, riskTolerance } = priorities;

  const scores: Record<string, number> = {};

  for (const [key, result] of Object.entries(scenarios)) {
    let score = 0;

    // Normalize impressions (higher is better for reach)
    const maxImpressions = Math.max(...Object.values(scenarios).map(s => s.impressions));
    const impressionScore = result.impressions / maxImpressions;
    score += impressionScore * reachImportance;

    // Normalize ROAS (higher is better)
    const maxRoas = Math.max(...Object.values(scenarios).map(s => s.roas.mid));
    const roasScore = result.roas.mid / maxRoas;
    score += roasScore * roasImportance;

    // Risk adjustment
    if (key === 'conversion' && riskTolerance > 0.5) {
      score *= 1.1; // Boost conversion for risk-tolerant users
    }
    if (key === 'awareness' && riskTolerance < 0.5) {
      score *= 1.1; // Boost awareness for risk-averse users
    }

    scores[key] = score;
  }

  const recommended = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0][0];

  const rationales: Record<string, string> = {
    awareness: "Based on your priorities emphasizing reach and brand building, the Awareness First strategy will maximize market penetration across EU3.",
    balanced: "Your balanced priorities suggest the Balanced Funnel approach will provide the most predictable results with flexibility to optimize.",
    conversion: "Given your focus on efficiency and ROI, the Retail Conversion strategy will deliver the best cost per sale leveraging the 'Real Reactions' approach."
  };

  return {
    recommended,
    rationale: rationales[recommended]
  };
}

export function generateQuickStats(scenario: ScenarioResult, budgetTier: BudgetTier) {
  return {
    impressionsPerDollar: scenario.impressions / budgetTier.mediaSpend,
    conversionEfficiency: scenario.sales.mid / scenario.impressions * 100,
    revenueMultiple: scenario.revenue.mid / budgetTier.totalBudget
  };
}
