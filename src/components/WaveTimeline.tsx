import { motion } from 'framer-motion';
import { Calendar, Rocket, Gift } from 'lucide-react';
import { waveList, months, getWaveColor } from '../data/waves';
import { formatPercent } from '../utils/formatters';
import { GlossaryTooltip } from './Tooltip';

interface WaveTimelineProps {
  selectedWave: 'wave1' | 'wave2' | 'all';
  onSelectWave: (wave: 'wave1' | 'wave2' | 'all') => void;
}

const waveIcons: Record<string, typeof Calendar> = {
  preLaunch: Calendar,
  wave1: Rocket,
  wave2: Gift
};

export function WaveTimeline({ selectedWave, onSelectWave }: WaveTimelineProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          <GlossaryTooltip term="Wave">Campaign Waves</GlossaryTooltip> (2026)
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectWave('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedWave === 'all'
                ? 'bg-primary-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Waves
          </button>
        </div>
      </div>

      {/* Timeline Header - Months */}
      <div className="relative mb-6">
        <div className="flex">
          {months.map((month) => (
            <div key={month.id} className="flex-1 text-center">
              <span className="text-xs text-gray-400">{month.short}</span>
            </div>
          ))}
        </div>

        {/* Wave Bars */}
        <div className="relative mt-2 space-y-2">
          {waveList.map((wave) => {
            const Icon = waveIcons[wave.id];
            const startOffset = ((wave.startMonth - 1) / 12) * 100;
            const width = ((wave.endMonth - wave.startMonth + 1) / 12) * 100;
            const isActive = selectedWave === 'all' || selectedWave === wave.id;
            const isClickable = wave.id !== 'preLaunch';

            return (
              <motion.div
                key={wave.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative h-10"
              >
                <motion.button
                  onClick={() => isClickable && onSelectWave(wave.id as 'wave1' | 'wave2')}
                  disabled={!isClickable}
                  style={{
                    left: `${startOffset}%`,
                    width: `${width}%`,
                    backgroundColor: isActive ? getWaveColor(wave.id) : '#e5e7eb'
                  }}
                  className={`absolute top-0 h-full rounded-lg flex items-center px-3 transition-all ${
                    isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                  } ${isActive ? 'opacity-100' : 'opacity-50'}`}
                  whileHover={isClickable ? { scale: 1.02 } : {}}
                  whileTap={isClickable ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {wave.name}
                    </span>
                    {wave.budgetSplit > 0 && (
                      <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                        {formatPercent(wave.budgetSplit)}
                      </span>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Wave Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {waveList.map((wave) => {
          const Icon = waveIcons[wave.id];
          const isActive = selectedWave === 'all' || selectedWave === wave.id;

          return (
            <div
              key={wave.id}
              className={`p-3 rounded-lg border transition-all ${
                isActive
                  ? 'border-gray-200 bg-white'
                  : 'border-transparent bg-gray-50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getWaveColor(wave.id) + '20' }}
                >
                  <Icon className="w-3 h-3" style={{ color: getWaveColor(wave.id) }} />
                </div>
                <span className="font-medium text-sm text-text-dark">{wave.name}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{wave.period}</p>
              <p className="text-xs font-medium text-primary-cyan">{wave.objective}</p>
              <p className="text-xs text-gray-400 mt-1">{wave.focus}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
