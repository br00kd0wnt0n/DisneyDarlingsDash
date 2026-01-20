import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';
import { formatCurrency, formatNumber, formatSalesRange, formatRevenueRange, formatROASRange, formatCostPerSaleRange } from '../utils/formatters';
import { GlossaryTooltip, SourceIndicator } from './Tooltip';
import type { DashboardMetrics } from '../hooks/useDashboardState';
import type { BudgetTier } from '../data/budgetTiers';

interface MetricsSidebarProps {
  metrics: DashboardMetrics;
  budgetTier: BudgetTier;
}

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: typeof Sparkles;
  color: string;
  glossaryTerm?: string;
  sourceField?: string;
}

function MetricCard({ label, value, subValue, icon: Icon, color, glossaryTerm, sourceField }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {sourceField && <SourceIndicator field={sourceField} />}
      </div>

      <div className="space-y-1">
        {glossaryTerm ? (
          <GlossaryTooltip term={glossaryTerm}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
          </GlossaryTooltip>
        ) : (
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        )}
        <p className="text-xl font-bold text-text-dark count-up">{value}</p>
        {subValue && (
          <p className="text-xs text-gray-400">{subValue}</p>
        )}
      </div>
    </motion.div>
  );
}

export function MetricsSidebar({ metrics, budgetTier }: MetricsSidebarProps) {
  return (
    <div className="space-y-3">
      {/* Total Budget */}
      <MetricCard
        label="Total Budget"
        value={formatCurrency(budgetTier.totalBudget, { compact: true })}
        subValue={`Media: ${formatCurrency(budgetTier.mediaSpend, { compact: true })}`}
        icon={DollarSign}
        color="#E91E8C"
        sourceField="totalBudget"
      />

      {/* Impressions */}
      <MetricCard
        label="Est. Impressions"
        value={formatNumber(metrics.impressions, { compact: true })}
        subValue={`Blended CPM: ${formatCurrency(metrics.blendedCPM, { decimals: 2 })}`}
        icon={BarChart3}
        color="#00C0E8"
        glossaryTerm="Impressions"
        sourceField="cpmTargeted"
      />

      {/* Sales Projection */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-cyan-50 border-2 border-primary-pink"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary-pink/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-pink sparkle" />
          </div>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Projected Sales</p>
        <p className="text-2xl font-bold text-primary-pink count-up">
          {formatSalesRange(metrics.displaySales)}
        </p>
        <p className="text-xs text-gray-500 mt-1">units</p>

        {/* Visual range bar */}
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary-pink to-primary-cyan rounded-full"
          />
        </div>
      </motion.div>

      {/* Revenue */}
      <MetricCard
        label="Revenue Projection"
        value={formatRevenueRange(metrics.displayRevenue)}
        icon={TrendingUp}
        color="#22c55e"
      />

      {/* ROAS */}
      <MetricCard
        label="Target ROAS"
        value={formatROASRange(metrics.displayRoas)}
        icon={Target}
        color="#FFD700"
        glossaryTerm="ROAS"
      />

      {/* Cost Per Sale */}
      <MetricCard
        label="Cost Per Sale"
        value={formatCostPerSaleRange(metrics.displayCostPerSale)}
        icon={DollarSign}
        color="#a855f7"
      />

      {/* Blended CPM */}
      <MetricCard
        label="Blended CPM"
        value={formatCurrency(metrics.blendedCPM, { decimals: 2 })}
        icon={BarChart3}
        color="#00C0E8"
        glossaryTerm="Blended CPM"
      />
    </div>
  );
}
