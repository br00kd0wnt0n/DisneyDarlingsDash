import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Database, GitBranch, DollarSign, Calculator, RotateCcw } from 'lucide-react';
import { channels } from '../data/channels';
import type { DataSource } from '../data/dataSources';
import { dataSourceLabels } from '../data/dataSources';
import type { FunnelAssumptions } from '../data/funnelAssumptions';
import { funnelStageLabels, funnelStageRanges } from '../data/funnelAssumptions';
import { formatPercent, formatCurrency, formatMultiplier } from '../utils/formatters';
import { SourceIndicator } from './Tooltip';

interface UnderTheHoodProps {
  funnelAssumptions: FunnelAssumptions;
  onUpdateFunnelAssumption: (key: keyof Omit<FunnelAssumptions, 'realReactionsBoost'>, value: number) => void;
  onResetFunnelAssumptions: () => void;
}

type TabId = 'sources' | 'funnel' | 'costs' | 'formula';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Database;
}

const tabs: Tab[] = [
  { id: 'sources', label: 'Data Sources', icon: Database },
  { id: 'funnel', label: 'Funnel Model', icon: GitBranch },
  { id: 'costs', label: 'Cost Model', icon: DollarSign },
  { id: 'formula', label: 'Forecast Formula', icon: Calculator }
];

export function UnderTheHood({
  funnelAssumptions,
  onUpdateFunnelAssumption,
  onResetFunnelAssumptions
}: UnderTheHoodProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('sources');

  const dataSourceItems = [
    { field: 'cpmBroad', label: 'CPM (Broad)', value: 'Various by channel', source: 'client' as DataSource },
    { field: 'cpmTargeted', label: 'CPM (Targeted)', value: 'Various by channel', source: 'client' as DataSource },
    { field: 'vtr', label: 'View-Through Rate', value: '45%-90%', source: 'industry' as DataSource },
    { field: 'conversionIndex', label: 'Conversion Index', value: '0.9x-1.8x', source: 'ralph' as DataSource },
    { field: 'avgDollPrice', label: 'Average Doll Price', value: '$60-61', source: 'client' as DataSource },
    { field: 'budgetSplit', label: 'Market Budget Split', value: 'UK 50%, DE/FR 25%', source: 'client' as DataSource },
    { field: 'priceSensitivity', label: 'Price Sensitivity', value: '1.0-1.2', source: 'ralph' as DataSource },
    { field: 'impressionsToAwareness', label: 'Impressions → Awareness', value: '15%', source: 'industry' as DataSource },
    { field: 'q4Multiplier', label: 'Q4 Multiplier', value: '1.4x', source: 'industry' as DataSource },
    { field: 'realReactionsBoost', label: 'Real Reactions Boost', value: '+20-35%', source: 'ralph' as DataSource },
  ];

  return (
    <div className="card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Under the Hood
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-text-dark shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {/* Data Sources Tab */}
              {activeTab === 'sources' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4 mb-4">
                    {Object.entries(dataSourceLabels).map(([key, info]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span>{info.icon}</span>
                        <span className="text-gray-500">{info.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 border-b">
                          <th className="text-left py-2 font-medium">Data Point</th>
                          <th className="text-left py-2 font-medium">Value</th>
                          <th className="text-left py-2 font-medium">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataSourceItems.map((item) => (
                          <tr key={item.field} className="border-b border-gray-50">
                            <td className="py-2 text-gray-700">{item.label}</td>
                            <td className="py-2 text-gray-600">{item.value}</td>
                            <td className="py-2">
                              <span className="flex items-center gap-1">
                                <span>{dataSourceLabels[item.source].icon}</span>
                                <span className="text-xs text-gray-500">
                                  {dataSourceLabels[item.source].label}
                                </span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Funnel Model Tab */}
              {activeTab === 'funnel' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Adjust conversion rate assumptions</p>
                    <button
                      onClick={onResetFunnelAssumptions}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-pink"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to Defaults
                    </button>
                  </div>

                  {(['impressionsToAwareness', 'awarenessToConsideration', 'considerationToIntent', 'intentToPurchase'] as const).map((key) => {
                    const range = funnelStageRanges[key];
                    const value = funnelAssumptions[key];

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{funnelStageLabels[key]}</span>
                          <div className="flex items-center gap-2">
                            <SourceIndicator field={key} />
                            <span className="font-semibold text-text-dark">
                              {formatPercent(value)}
                            </span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={range.min * 100}
                          max={range.max * 100}
                          step={range.step * 100}
                          value={value * 100}
                          onChange={(e) => onUpdateFunnelAssumption(key, parseFloat(e.target.value) / 100)}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{formatPercent(range.min)}</span>
                          <span>{formatPercent(range.max)}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Q4 Multiplier */}
                  <div className="space-y-1 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{funnelStageLabels.q4Multiplier}</span>
                      <div className="flex items-center gap-2">
                        <SourceIndicator field="q4Multiplier" />
                        <span className="font-semibold text-text-dark">
                          {formatMultiplier(funnelAssumptions.q4Multiplier)}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={funnelStageRanges.q4Multiplier.min * 10}
                      max={funnelStageRanges.q4Multiplier.max * 10}
                      step={funnelStageRanges.q4Multiplier.step * 10}
                      value={funnelAssumptions.q4Multiplier * 10}
                      onChange={(e) => onUpdateFunnelAssumption('q4Multiplier', parseFloat(e.target.value) / 10)}
                      className="w-full"
                    />
                  </div>

                  {/* Real Reactions Boost (read-only display) */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Real Reactions Boost</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Consideration</p>
                        <p className="font-semibold text-primary-cyan">+{formatPercent(funnelAssumptions.realReactionsBoost.consideration - 1)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Trust</p>
                        <p className="font-semibold text-primary-cyan">+{formatPercent(funnelAssumptions.realReactionsBoost.trust - 1)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">POS Conv.</p>
                        <p className="font-semibold text-primary-cyan">+{formatPercent(funnelAssumptions.realReactionsBoost.posConversion - 1)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Model Tab */}
              {activeTab === 'costs' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">Channel CPM and efficiency metrics (read-only)</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 border-b">
                          <th className="text-left py-2 font-medium">Channel</th>
                          <th className="text-right py-2 font-medium">CPM (Broad)</th>
                          <th className="text-right py-2 font-medium">CPM (Targeted)</th>
                          <th className="text-right py-2 font-medium">VTR</th>
                          <th className="text-right py-2 font-medium">Conv. Index</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channels.map((channel) => (
                          <tr key={channel.id} className="border-b border-gray-50">
                            <td className="py-2 font-medium text-gray-700">{channel.name}</td>
                            <td className="py-2 text-right text-gray-600">
                              {channel.cpmBroad ? formatCurrency(channel.cpmBroad, { decimals: 2 }) : '—'}
                            </td>
                            <td className="py-2 text-right text-gray-600">
                              {formatCurrency(channel.cpmTargeted, { decimals: 2 })}
                            </td>
                            <td className="py-2 text-right text-gray-600">
                              {formatPercent(channel.vtr)}
                            </td>
                            <td className="py-2 text-right">
                              <span className={channel.conversionIndex >= 1.2 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                {formatMultiplier(channel.conversionIndex)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Formula Tab */}
              {activeTab === 'formula' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">Sales projection calculation methodology</p>

                  <div className="p-4 bg-gray-900 rounded-xl text-white font-mono text-sm">
                    <pre className="whitespace-pre-wrap">
{`Sales = Impressions
  × [Awareness Rate: ${formatPercent(funnelAssumptions.impressionsToAwareness)}]
  × [Consideration Rate: ${formatPercent(funnelAssumptions.awarenessToConsideration)}] × [Real Reactions Boost: ${formatMultiplier(funnelAssumptions.realReactionsBoost.consideration)}]
  × [Intent Rate: ${formatPercent(funnelAssumptions.considerationToIntent)}] × [Trust Boost: ${formatMultiplier(funnelAssumptions.realReactionsBoost.trust)}]
  × [Purchase Rate: ${formatPercent(funnelAssumptions.intentToPurchase)}] × [POS Boost: ${formatMultiplier(funnelAssumptions.realReactionsBoost.posConversion)}]
  × [Q4 Multiplier: ${formatMultiplier(funnelAssumptions.q4Multiplier)}] (if holiday wave)

Revenue = Sales × [Weighted Avg Price: ~$60.25]
ROAS = Revenue ÷ [Total Budget]
Cost Per Sale = [Total Budget] ÷ Sales`}
                    </pre>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-700">
                      <strong>Tip:</strong> Click on the "Funnel Model" tab to adjust the bracketed variables in real-time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
