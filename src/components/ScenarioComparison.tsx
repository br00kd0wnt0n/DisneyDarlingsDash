import { motion } from 'framer-motion';
import { Check, Target, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import type { ScenarioComparisonData } from '../hooks/useScenarioComparison';
import { formatNumber, formatCurrency, formatMultiplier } from '../utils/formatters';

interface ScenarioComparisonProps {
  data: ScenarioComparisonData;
  onApplyScenario: (scenarioId: string) => void;
  onClose: () => void;
}

// Generate monthly projection data for chart
function generateMonthlyData(totalSales: number) {
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const distribution = [0, 0, 0, 0.02, 0.04, 0.05, 0.08, 0.12, 0.18, 0.25, 0.26];
  let cumulative = 0;

  return months.map((month, i) => {
    cumulative += distribution[i] * totalSales;
    return {
      month,
      sales: Math.round(cumulative)
    };
  });
}

export function ScenarioComparison({ data, onApplyScenario, onClose }: ScenarioComparisonProps) {
  const { scenarios, comparison, presets, bestScenario } = data;

  const scenarioOrder = ['awareness', 'balanced', 'conversion'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-text-dark">Compare Strategic Scenarios</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Three Scenario Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {scenarioOrder.map((scenarioId, index) => {
          const scenario = scenarios[scenarioId];
          const preset = presets[scenarioId];
          const isBest = scenarioId === bestScenario;

          const chartData = generateMonthlyData(scenario.sales.mid);

          return (
            <motion.div
              key={scenarioId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`p-4 rounded-xl border-2 ${
                isBest ? 'border-primary-pink bg-pink-50/50' : 'border-gray-200 bg-white'
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{preset.icon}</span>
                <div>
                  <h3 className="font-bold text-text-dark">{preset.name}</h3>
                  <p className="text-xs text-gray-500">{preset.tagline}</p>
                </div>
                {isBest && (
                  <span className="ml-auto px-2 py-1 bg-primary-pink text-white text-xs font-medium rounded-full">
                    Best ROAS
                  </span>
                )}
              </div>

              {/* Chart */}
              <div className="h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <RechartsTooltip
                      formatter={(value) => [formatNumber(value as number), 'Sales']}
                      contentStyle={{
                        backgroundColor: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke={isBest ? '#E91E8C' : '#00C0E8'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Impressions</p>
                  <p className="font-bold text-text-dark">
                    {formatNumber(scenario.impressions, { compact: true })}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Sales</p>
                  <p className="font-bold text-primary-pink">
                    {formatNumber(scenario.sales.low, { compact: true })}-{formatNumber(scenario.sales.high, { compact: true })}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">ROAS</p>
                  <p className="font-bold text-green-600">
                    {formatMultiplier(scenario.roas.mid)}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Cost/Sale</p>
                  <p className="font-bold text-text-dark">
                    {formatCurrency(scenario.costPerSale.mid, { decimals: 2 })}
                  </p>
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Strengths</p>
                <div className="space-y-1">
                  {preset.strengths.slice(0, 3).map((strength, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade-offs */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Trade-offs</p>
                <div className="space-y-1">
                  {preset.tradeoffs.slice(0, 2).map((tradeoff, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 text-xs mt-0.5">⚠️</span>
                      <span className="text-xs text-gray-600">{tradeoff}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => onApplyScenario(scenarioId)}
                className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                  isBest
                    ? 'bg-primary-pink text-white hover:bg-pink-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Apply This Strategy
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Summary */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border border-purple-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Dynamic Comparison</p>
            <p className="text-sm text-gray-600">{comparison}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
