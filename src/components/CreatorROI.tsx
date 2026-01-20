import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, TrendingUp } from 'lucide-react';
import type { Creator } from '../data/creators';
import { getAllCreators, getCreatorStats } from '../data/creators';
import { markets } from '../data/markets';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface CreatorROIProps {
  selectedMarket?: string;
}

export function CreatorROI({ selectedMarket }: CreatorROIProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rate' | 'sales'>('sales');
  const [filterMarket, setFilterMarket] = useState<string>(selectedMarket || 'all');

  const stats = getCreatorStats();

  const allCreators = getAllCreators();
  const filteredCreators = filterMarket === 'all'
    ? allCreators
    : allCreators.filter(c => c.market === filterMarket);

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rate') return b.rate - a.rate;
    return (b.estSales[1] + b.estSales[0]) / 2 - (a.estSales[1] + a.estSales[0]) / 2;
  });

  const calculateCostPerSale = (creator: Creator & { market: string }) => {
    const avgSales = (creator.estSales[0] + creator.estSales[1]) / 2;
    return creator.rate / avgSales;
  };

  return (
    <div className="card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-pink" />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Creator ROI
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Total Investment</p>
          <p className="font-bold text-text-dark">
            {formatCurrency(stats.totalCost, { compact: true })}
          </p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Est. Reach</p>
          <p className="font-bold text-text-dark">
            {formatNumber(stats.totalReach, { compact: true })}
          </p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Est. Sales</p>
          <p className="font-bold text-primary-pink">
            {formatNumber(stats.totalSalesLow, { compact: true })}-{formatNumber(stats.totalSalesHigh, { compact: true })}
          </p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Avg CPS</p>
          <p className="font-bold text-green-600">
            {formatCurrency(stats.totalCost / ((stats.totalSalesLow + stats.totalSalesHigh) / 2), { decimals: 2 })}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Filters */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Market:</span>
                <select
                  value={filterMarket}
                  onChange={(e) => setFilterMarket(e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1 bg-white"
                >
                  <option value="all">All Markets</option>
                  {Object.entries(markets).map(([id, market]) => (
                    <option key={id} value={id}>
                      {market.flag} {market.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'rate' | 'sales')}
                  className="text-xs border rounded-lg px-2 py-1 bg-white"
                >
                  <option value="sales">Est. Sales</option>
                  <option value="rate">Cost</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Creator Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b">
                    <th className="text-left py-2 font-medium">Creator</th>
                    <th className="text-left py-2 font-medium">Platform</th>
                    <th className="text-right py-2 font-medium">Followers</th>
                    <th className="text-right py-2 font-medium">Cost</th>
                    <th className="text-right py-2 font-medium">Est. Reach</th>
                    <th className="text-right py-2 font-medium">Est. Sales</th>
                    <th className="text-right py-2 font-medium">Cost/Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCreators.map((creator, index) => {
                    const market = markets[creator.market];
                    const costPerSale = calculateCostPerSale(creator);

                    return (
                      <motion.tr
                        key={`${creator.market}-${creator.name}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{market.flag}</span>
                            <span className="font-medium text-text-dark">{creator.name}</span>
                          </div>
                        </td>
                        <td className="py-2 text-gray-500">{creator.platform}</td>
                        <td className="py-2 text-right text-gray-600">{creator.followers}</td>
                        <td className="py-2 text-right font-medium">
                          {creator.currency}{formatNumber(creator.rate)}
                        </td>
                        <td className="py-2 text-right text-gray-600">
                          {formatNumber(creator.estReach, { compact: true })}
                        </td>
                        <td className="py-2 text-right font-medium text-primary-pink">
                          {creator.estSales[0]}-{creator.estSales[1]}
                        </td>
                        <td className="py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {costPerSale < 50 && (
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            )}
                            <span className={costPerSale < 50 ? 'text-green-600' : 'text-gray-600'}>
                              {creator.currency}{costPerSale.toFixed(2)}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
