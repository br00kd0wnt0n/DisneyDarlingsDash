export interface Creator {
  name: string;
  platform: string;
  followers: string;
  rate: number;
  currency: string;
  estReach: number;
  estSales: [number, number];
}

export const creators: Record<string, Creator[]> = {
  uk: [
    { name: "Chloe & Eliza", platform: "TikTok/IG", followers: "250k", rate: 3000, currency: "£", estReach: 150000, estSales: [45, 75] },
    { name: "Fatima Flatt", platform: "TikTok/IG/YT", followers: "2.4M", rate: 5000, currency: "£", estReach: 500000, estSales: [120, 200] },
    { name: "Harleigh Fairgrieve", platform: "TikTok/IG", followers: "2.5M", rate: 10000, currency: "£", estReach: 800000, estSales: [180, 300] }
  ],
  germany: [
    { name: "Lisa Oelmuller", platform: "TikTok/IG/YT", followers: "1M", rate: 6000, currency: "€", estReach: 300000, estSales: [60, 100] },
    { name: "Mamiseelen", platform: "YouTube/IG", followers: "6M", rate: 8000, currency: "€", estReach: 1200000, estSales: [200, 350] },
    { name: "Amandine", platform: "IG", followers: "29k", rate: 2000, currency: "€", estReach: 20000, estSales: [15, 30] }
  ],
  france: [
    { name: "Anissa Loisel", platform: "IG/TikTok", followers: "108k", rate: 2000, currency: "€", estReach: 50000, estSales: [25, 45] },
    { name: "Jessica Thivenin", platform: "TikTok/IG/YT", followers: "9M", rate: 10000, currency: "€", estReach: 2000000, estSales: [350, 500] },
    { name: "Justine Olv", platform: "IG/TikTok", followers: "993k", rate: 4000, currency: "€", estReach: 250000, estSales: [70, 120] }
  ]
};

export const getAllCreators = (): (Creator & { market: string })[] => {
  return Object.entries(creators).flatMap(([market, creatorList]) =>
    creatorList.map(creator => ({ ...creator, market }))
  );
};

export const getCreatorStats = () => {
  const all = getAllCreators();
  return {
    totalCost: all.reduce((acc, c) => acc + c.rate, 0),
    totalReach: all.reduce((acc, c) => acc + c.estReach, 0),
    totalSalesLow: all.reduce((acc, c) => acc + c.estSales[0], 0),
    totalSalesHigh: all.reduce((acc, c) => acc + c.estSales[1], 0),
  };
};
