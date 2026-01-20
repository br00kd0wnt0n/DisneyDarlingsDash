import { motion } from 'framer-motion';
import { TrendingUp, Store } from 'lucide-react';
import { formatCurrency, formatNumber, formatSalesRange } from '../utils/formatters';
import { GlossaryTooltip } from './Tooltip';

interface MarketMetric {
  id: string;
  name: string;
  flag: string;
  currency: string;
  localPrice: number;
  primaryRetailer: string;
  brandAffinity: string;
  spend: number;
  impressions: number;
  sales: { low: number; high: number; mid: number };
  revenue: { low: number; high: number; mid: number };
}

interface MarketCardsProps {
  markets: MarketMetric[];
}

export function MarketCards({ markets }: MarketCardsProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          <GlossaryTooltip term="EU3">Market Breakdown (EU3)</GlossaryTooltip>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {markets.map((market, index) => (
          <motion.div
            key={market.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{market.flag}</span>
              <span className="font-semibold text-text-dark">{market.name}</span>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3">
              {/* Budget Allocation */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Budget</span>
                <span className="font-medium text-text-dark">
                  {formatCurrency(market.spend, { compact: true })}
                </span>
              </div>

              {/* Impressions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Impressions</span>
                <span className="font-medium text-text-dark">
                  {formatNumber(market.impressions, { compact: true })}
                </span>
              </div>

              {/* Sales */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Sales</span>
                <span className="font-bold text-primary-pink">
                  {formatSalesRange(market.sales)}
                </span>
              </div>

              {/* Revenue */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Revenue</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="font-semibold text-green-600">
                    {formatCurrency(market.revenue.low, { compact: true })} - {formatCurrency(market.revenue.high, { compact: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer - Retailer */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">{market.primaryRetailer}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Local Price</span>
                <span className="text-sm font-medium">
                  {market.currency}{market.localPrice}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">Brand Affinity</span>
                <span className={`text-xs font-medium ${
                  market.brandAffinity === 'High' ? 'text-green-600' :
                  market.brandAffinity === 'Medium-High' ? 'text-blue-600' :
                  'text-amber-600'
                }`}>
                  {market.brandAffinity}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
