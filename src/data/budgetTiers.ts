export interface BudgetTier {
  id: string;
  name: string;
  totalBudget: number;
  mediaSpend: number;
  creativeSpend: number;
  strategySpend: number;
  researchSpend: number;
  planningSpend: number;
  color: string;
  description: string;
}

export const budgetTiers: Record<string, BudgetTier> = {
  bronze: {
    id: "bronze",
    name: "Bronze",
    totalBudget: 842836,
    mediaSpend: 300000,
    creativeSpend: 281136,
    strategySpend: 71920,
    researchSpend: 109460,
    planningSpend: 80320,
    color: "#CD7F32",
    description: "Entry-level launch package for focused UK market presence"
  },
  silver: {
    id: "silver",
    name: "Silver",
    totalBudget: 1060336,
    mediaSpend: 500000,
    creativeSpend: 281136,
    strategySpend: 71920,
    researchSpend: 109460,
    planningSpend: 97820,
    color: "#C0C0C0",
    description: "Balanced approach with expanded EU3 reach"
  },
  gold: {
    id: "gold",
    name: "Gold",
    totalBudget: 1597836,
    mediaSpend: 1000000,
    creativeSpend: 281136,
    strategySpend: 71920,
    researchSpend: 109460,
    planningSpend: 135320,
    color: "#FFD700",
    description: "Full-scale EU3 campaign with TV and premium placements"
  }
};

export const budgetTierList = Object.values(budgetTiers);

export const getBudgetBreakdown = (tier: BudgetTier) => {
  return [
    { name: 'Media', value: tier.mediaSpend, color: '#E91E8C' },
    { name: 'Creative', value: tier.creativeSpend, color: '#00C0E8' },
    { name: 'Strategy', value: tier.strategySpend, color: '#FFD700' },
    { name: 'Research', value: tier.researchSpend, color: '#a855f7' },
    { name: 'Planning', value: tier.planningSpend, color: '#22c55e' },
  ];
};
