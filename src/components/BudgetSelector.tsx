import { motion } from 'framer-motion';
import { Check, TrendingUp } from 'lucide-react';
import type { BudgetTier } from '../data/budgetTiers';
import { budgetTierList, getBudgetBreakdown } from '../data/budgetTiers';
import { formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface BudgetSelectorProps {
  selectedTier: BudgetTier;
  onSelectTier: (tier: BudgetTier | string) => void;
}

export function BudgetSelector({ selectedTier, onSelectTier }: BudgetSelectorProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Budget Tier
      </h3>

      <div className="space-y-3">
        {budgetTierList.map((tier) => {
          const isSelected = selectedTier.id === tier.id;
          const breakdown = getBudgetBreakdown(tier);

          return (
            <motion.button
              key={tier.id}
              onClick={() => onSelectTier(tier)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary-pink bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-semibold text-text-dark">{tier.name}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-primary-pink flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>

                  <p className="text-2xl font-bold text-text-dark mt-1">
                    {formatCurrency(tier.totalBudget, { compact: true })}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">{tier.description}</p>

                  <div className="flex items-center gap-1 mt-2 text-xs text-primary-cyan">
                    <TrendingUp className="w-3 h-3" />
                    <span>Media: {formatCurrency(tier.mediaSpend, { compact: true })}</span>
                  </div>
                </div>

                {/* Mini pie chart */}
                <div className="w-16 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdown}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={18}
                        outerRadius={28}
                        paddingAngle={2}
                      >
                        {breakdown.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Budget Breakdown Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Budget Breakdown</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {getBudgetBreakdown(selectedTier).map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600">{item.name}</span>
              <span className="text-gray-400 ml-auto">
                {formatCurrency(item.value, { compact: true })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
