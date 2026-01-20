import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Eye, Heart, Target, ShoppingBag } from 'lucide-react';
import { formatNumber, formatPercent } from '../utils/formatters';
import { GlossaryTooltip } from './Tooltip';

interface SalesFunnelProps {
  impressions: number;
  awareness: number;
  consideration: number;
  intent: number;
  sales: { low: number; high: number; mid: number };
}

interface FunnelStage {
  id: string;
  label: string;
  value: number;
  icon: typeof Eye;
  color: string;
  rate?: number;
  glossaryTerm?: string;
}

export function SalesFunnel({
  impressions,
  awareness,
  consideration,
  intent,
  sales
}: SalesFunnelProps) {
  const stages: FunnelStage[] = [
    {
      id: 'impressions',
      label: 'Impressions',
      value: impressions,
      icon: Eye,
      color: '#E91E8C',
      glossaryTerm: 'Impressions'
    },
    {
      id: 'awareness',
      label: 'Awareness',
      value: awareness,
      icon: Sparkles,
      color: '#D81B7A',
      rate: awareness / impressions,
      glossaryTerm: 'Awareness'
    },
    {
      id: 'consideration',
      label: 'Consideration',
      value: consideration,
      icon: Heart,
      color: '#00C0E8',
      rate: consideration / awareness,
      glossaryTerm: 'Consideration'
    },
    {
      id: 'intent',
      label: 'Intent',
      value: intent,
      icon: Target,
      color: '#00A8D0',
      rate: intent / consideration,
      glossaryTerm: 'Intent'
    },
    {
      id: 'sales',
      label: 'Sales',
      value: sales.mid,
      icon: ShoppingBag,
      color: '#FFD700',
      rate: sales.mid / intent
    }
  ];

  const maxValue = impressions;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Sales Funnel
        </h3>
      </div>

      <div className="space-y-2">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const widthPercent = Math.max(20, (stage.value / maxValue) * 100);

          return (
            <div key={stage.id}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className="rounded-lg p-3 transition-all hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: stage.color + '20' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: stage.color }} />
                      {stage.glossaryTerm ? (
                        <GlossaryTooltip term={stage.glossaryTerm}>
                          <span className="text-sm font-medium text-gray-700">
                            {stage.label}
                          </span>
                        </GlossaryTooltip>
                      ) : (
                        <span className="text-sm font-medium text-gray-700">
                          {stage.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {stage.rate && (
                        <span className="text-xs text-gray-400">
                          {formatPercent(stage.rate)}
                        </span>
                      )}
                      <span className="font-bold text-text-dark">
                        {stage.id === 'sales'
                          ? `${formatNumber(sales.low, { compact: true })} - ${formatNumber(sales.high, { compact: true })}`
                          : formatNumber(stage.value, { compact: true })
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar at bottom */}
                <div
                  className="absolute bottom-0 left-0 h-1 rounded-b-lg"
                  style={{
                    width: '100%',
                    backgroundColor: stage.color
                  }}
                />
              </motion.div>

              {/* Arrow connector */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Overall Conversion</span>
          <span className="font-bold text-primary-pink">
            {formatPercent(sales.mid / impressions, 4)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          From {formatNumber(impressions, { compact: true })} impressions to{' '}
          {formatNumber(sales.low, { compact: true })}-{formatNumber(sales.high, { compact: true })} sales
        </p>
      </div>
    </div>
  );
}
