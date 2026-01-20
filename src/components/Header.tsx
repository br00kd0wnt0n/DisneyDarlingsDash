import { Sparkles, Monitor, Layers } from 'lucide-react';

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
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-pink to-primary-cyan flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-dark flex items-center gap-2">
                Disney Darlings
                <span className="text-primary-pink">✦</span>
              </h1>
              <p className="text-xs text-gray-500">Sales Forecast Dashboard</p>
            </div>
          </div>

          {/* Campaign Badge */}
          <div className="hidden md:flex items-center gap-2 bg-background-light-blue px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium text-primary-cyan">EMEA Launch 2026</span>
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
          <div className="flex items-center gap-2 text-gray-400 text-sm border-l pl-3 ml-2">
            <span className="font-medium">ralph</span>
          </div>
        </div>
      </div>
    </header>
  );
}
