export const glossary: Record<string, string> = {
  "CPM": "Cost Per Mille - the cost to deliver 1,000 ad impressions",
  "VTR": "View-Through Rate - percentage of users who watch a video ad",
  "ROAS": "Return on Ad Spend - revenue generated divided by total campaign budget",
  "Blended CPM": "Weighted average CPM across all channels based on allocation",
  "Conversion Index": "Channel's effectiveness at driving sales vs. baseline (1.0 = average)",
  "Price Sensitivity": "Market's responsiveness to price - higher values mean more price-conscious buyers",
  "Brand Affinity": "Market's existing positive association with Disney brand",
  "Real Reactions": "Ralph's content strategy emphasizing authentic responses and proof",
  "POS": "Point of Sale - physical or digital retail location where purchase occurs",
  "EU3": "European Union 3 - UK, Germany, and France (primary markets)",
  "Wave": "Distinct campaign phase with specific objectives and budget allocation",
  "CTV": "Connected TV - streaming services like Disney+, Netflix accessed via smart TVs",
  "OOH/DOOH": "Out-of-Home / Digital Out-of-Home - billboards and digital signage",
  "DSP": "Demand Side Platform - programmatic ad buying technology (e.g., Amazon DSP)",
  "UGC": "User Generated Content - authentic content created by real customers",
  "Impressions": "Number of times an ad is displayed to a user",
  "Awareness": "Consumer recognition and recall of the brand",
  "Consideration": "Active evaluation of the product for purchase",
  "Intent": "Strong likelihood to purchase in the near term",
  "Q4 Multiplier": "Holiday season sales boost factor (typically 40% increase)",
};

export const getGlossaryTerm = (term: string): string | undefined => {
  return glossary[term] || Object.entries(glossary).find(
    ([key]) => key.toLowerCase() === term.toLowerCase()
  )?.[1];
};
