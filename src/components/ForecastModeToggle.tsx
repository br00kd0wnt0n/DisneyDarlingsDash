import { motion } from 'framer-motion';
import type { ForecastMode } from '../utils/calculations';
import { forecastModeLabels } from '../utils/calculations';

interface ForecastModeToggleProps {
  mode: ForecastMode;
  onModeChange: (mode: ForecastMode) => void;
}

const modes: ForecastMode[] = ['conservative', 'moderate', 'aggressive'];

export function ForecastModeToggle({ mode, onModeChange }: ForecastModeToggleProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Forecast Confidence
      </h3>

      <div className="flex rounded-lg bg-gray-100 p-1">
        {modes.map((m) => {
          const isActive = mode === m;
          const modeInfo = forecastModeLabels[m];

          return (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`relative flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive ? 'text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="forecastMode"
                  className="absolute inset-0 bg-gradient-to-r from-primary-pink to-primary-cyan rounded-md"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{modeInfo.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {forecastModeLabels[mode].description}
      </p>
    </div>
  );
}
