export interface Market {
  id: string;
  name: string;
  flag: string;
  budgetSplit: number;
  avgDollPrice: number;
  priceSensitivity: number;
  brandAffinity: string;
  primaryRetailer: string;
  currency: string;
  localPrice: number;
}

export const markets: Record<string, Market> = {
  uk: {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    budgetSplit: 0.50,
    avgDollPrice: 61,
    priceSensitivity: 1.0,
    brandAffinity: "High",
    primaryRetailer: "Smyths",
    currency: "£",
    localPrice: 45
  },
  germany: {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    budgetSplit: 0.25,
    avgDollPrice: 60,
    priceSensitivity: 1.2,
    brandAffinity: "Medium",
    primaryRetailer: "Amazon/Müller",
    currency: "€",
    localPrice: 55
  },
  france: {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    budgetSplit: 0.25,
    avgDollPrice: 60,
    priceSensitivity: 1.1,
    brandAffinity: "Medium-High",
    primaryRetailer: "Amazon/Fnac",
    currency: "€",
    localPrice: 55
  }
};

export const marketList = Object.values(markets);
