import { motion } from 'framer-motion';
import { RotateCcw, AlertCircle, Tv, MonitorPlay, Youtube, Facebook, Music2, MapPin, Users, ShoppingCart } from 'lucide-react';
import { channels } from '../data/channels';
import type { ChannelMix } from '../utils/calculations';
import { formatPercent, formatCurrency } from '../utils/formatters';
import { Tooltip, SourceIndicator } from './Tooltip';

interface ChannelMixControlsProps {
  channelMix: ChannelMix;
  onUpdateChannel: (channelId: string, value: number) => void;
  onReset: () => void;
  isValid: boolean;
  total: number;
  message?: string;
  mediaSpend: number;
}

const channelIcons: Record<string, typeof Tv> = {
  tv: Tv,
  ctv: MonitorPlay,
  youtube: Youtube,
  meta: Facebook,
  tiktok: Music2,
  ooh: MapPin,
  creators: Users,
  retail: ShoppingCart
};

export function ChannelMixControls({
  channelMix,
  onUpdateChannel,
  onReset,
  isValid,
  total,
  message,
  mediaSpend
}: ChannelMixControlsProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Channel Mix
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-pink transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Validation Warning */}
      {!isValid && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}

      {/* Total Indicator */}
      <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">Total Allocation</span>
        <span className={`font-semibold ${isValid ? 'text-green-600' : 'text-amber-600'}`}>
          {formatPercent(total)}
        </span>
      </div>

      {/* Channel Sliders */}
      <div className="space-y-4">
        {channels.map((channel) => {
          const Icon = channelIcons[channel.id] || Tv;
          const allocation = channelMix[channel.id] || 0;
          const spend = mediaSpend * allocation;

          return (
            <div key={channel.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <Tooltip content={channel.description} position="right">
                    <span className="text-sm font-medium text-gray-700 cursor-help">
                      {channel.name}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {formatCurrency(spend, { compact: true })}
                  </span>
                  <span className="text-sm font-semibold text-text-dark w-12 text-right">
                    {formatPercent(allocation)}
                  </span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={allocation * 100}
                  onChange={(e) => onUpdateChannel(channel.id, parseFloat(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #E91E8C 0%, #00C0E8 ${allocation * 100}%, #e5e7eb ${allocation * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              {/* Channel Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>CPM: ${channel.cpmTargeted}</span>
                <span>Conv: {channel.conversionIndex}x</span>
                <SourceIndicator field="conversionIndex" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
