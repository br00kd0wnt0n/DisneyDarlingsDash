import { Monitor, Layers } from 'lucide-react';

interface HeaderProps {
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  onToggleScenarioComparison: () => void;
  showScenarioComparison: boolean;
}

export function Header({
  isPresentationMode,
  onTogglePresentationMode,
  onToggleScenarioComparison,
  showScenarioComparison
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/darlings_Logo.png"
              alt="Disney Darlings"
              className="h-12 w-auto"
            />
            <div className="border-l border-gray-200 pl-3">
              <p className="text-sm font-medium text-gray-600">Sales Forecast</p>
              <p className="text-xs text-gray-400">EMEA Launch 2026</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Scenario Comparison Toggle */}
          <button
            onClick={onToggleScenarioComparison}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              showScenarioComparison
                ? 'bg-primary-cyan text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Compare Scenarios</span>
          </button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={onTogglePresentationMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isPresentationMode
                ? 'bg-primary-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">{isPresentationMode ? 'Exit Presentation' : 'Present'}</span>
          </button>

          {/* Ralph Branding */}
          <div className="border-l pl-3 ml-2">
            <img
              src="/ralph_logo.png"
              alt="ralph"
              className="h-6 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
