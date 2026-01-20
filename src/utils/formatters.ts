export function formatCurrency(
  value: number,
  options: {
    currency?: string;
    compact?: boolean;
    decimals?: number;
  } = {}
): string {
  const { currency = 'USD', compact = false, decimals = 0 } = options;

  if (compact) {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

export function formatNumber(
  value: number,
  options: {
    compact?: boolean;
    decimals?: number;
  } = {}
): string {
  const { compact = false, decimals = 0 } = options;

  if (compact) {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

export function formatPercent(
  value: number,
  decimals: number = 0
): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatRange(
  low: number,
  high: number,
  formatter: (v: number) => string = formatNumber
): string {
  return `${formatter(low)} - ${formatter(high)}`;
}

export function formatMultiplier(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}x`;
}

export function formatSalesRange(sales: { low: number; high: number }): string {
  return `${formatNumber(sales.low, { compact: true })} - ${formatNumber(sales.high, { compact: true })}`;
}

export function formatRevenueRange(revenue: { low: number; high: number }): string {
  return `${formatCurrency(revenue.low, { compact: true })} - ${formatCurrency(revenue.high, { compact: true })}`;
}

export function formatROASRange(roas: { low: number; high: number }): string {
  return `${roas.low.toFixed(1)}x - ${roas.high.toFixed(1)}x`;
}

export function formatCostPerSaleRange(cps: { low: number; high: number }): string {
  return `${formatCurrency(cps.low, { decimals: 2 })} - ${formatCurrency(cps.high, { decimals: 2 })}`;
}

export function formatCompactValue(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

export function abbreviateNumber(value: number): { value: number; suffix: string } {
  if (value >= 1000000000) {
    return { value: value / 1000000000, suffix: 'B' };
  }
  if (value >= 1000000) {
    return { value: value / 1000000, suffix: 'M' };
  }
  if (value >= 1000) {
    return { value: value / 1000, suffix: 'K' };
  }
  return { value, suffix: '' };
}
