export type DataSource = "client" | "industry" | "ralph";

export interface DataSourceInfo {
  icon: string;
  label: string;
  color: string;
}

export const dataSourceLabels: Record<DataSource, DataSourceInfo> = {
  client: { icon: "🟢", label: "JAKKS/Budget Sheet", color: "#22c55e" },
  industry: { icon: "🔵", label: "Industry Benchmark", color: "#3b82f6" },
  ralph: { icon: "🟣", label: "Ralph Methodology", color: "#a855f7" }
};

export const dataSourceMapping: Record<string, DataSource> = {
  // Channel data
  cpmBroad: "client",
  cpmTargeted: "client",
  vtr: "industry",
  conversionIndex: "ralph",

  // Market data
  avgDollPrice: "client",
  budgetSplit: "client",
  priceSensitivity: "ralph",
  brandAffinity: "ralph",

  // Budget data
  totalBudget: "client",
  mediaSpend: "client",
  creativeSpend: "client",
  strategySpend: "client",
  researchSpend: "client",
  planningSpend: "client",

  // Funnel assumptions
  impressionsToAwareness: "industry",
  awarenessToConsideration: "industry",
  considerationToIntent: "industry",
  intentToPurchase: "industry",
  realReactionsBoost: "ralph",
  q4Multiplier: "industry",

  // Creator data
  creatorRate: "client",
  creatorReach: "ralph",
  creatorSales: "ralph",
};

export const getDataSource = (field: string): DataSource => {
  return dataSourceMapping[field] || "ralph";
};

export const getDataSourceInfo = (field: string): DataSourceInfo => {
  const source = getDataSource(field);
  return dataSourceLabels[source];
};
