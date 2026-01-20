import { AnimatePresence } from 'framer-motion';
import { useDashboardState } from './hooks/useDashboardState';
import { useScenarioComparison } from './hooks/useScenarioComparison';
import {
  Header,
  BudgetSelector,
  ChannelMixControls,
  SalesFunnel,
  MarketCards,
  WaveTimeline,
  CreatorROI,
  MetricsSidebar,
  ForecastModeToggle,
  AIAssessment,
  ScenarioComparison,
  UnderTheHood
} from './components';

function App() {
  const {
    state,
    metrics,
    setSelectedTier,
    updateChannelAllocation,
    setChannelMix,
    setForecastMode,
    updateFunnelAssumption,
    resetFunnelAssumptions,
    setSelectedWave,
    togglePresentationMode,
    toggleScenarioComparison,
    applyScenarioPreset,
    resetChannelMix
  } = useDashboardState();

  const scenarioData = useScenarioComparison(
    state.selectedTier,
    state.selectedWave === 'wave2' || state.selectedWave === 'all'
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header
        isPresentationMode={state.isPresentationMode}
        onTogglePresentationMode={togglePresentationMode}
        onToggleScenarioComparison={toggleScenarioComparison}
        showScenarioComparison={state.showScenarioComparison}
      />

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Scenario Comparison (conditional) */}
        <AnimatePresence>
          {state.showScenarioComparison && (
            <ScenarioComparison
              data={scenarioData}
              onApplyScenario={applyScenarioPreset}
              onClose={toggleScenarioComparison}
            />
          )}
        </AnimatePresence>

        {/* Main Dashboard Grid */}
        <div className={`grid gap-6 ${state.isPresentationMode ? 'lg:grid-cols-[1fr_280px]' : 'lg:grid-cols-[280px_1fr_280px]'}`}>
          {/* Left Sidebar - Controls (hidden in presentation mode) */}
          {!state.isPresentationMode && (
            <aside className="space-y-6">
              <BudgetSelector
                selectedTier={state.selectedTier}
                onSelectTier={setSelectedTier}
              />

              <ChannelMixControls
                channelMix={state.channelMix}
                onUpdateChannel={updateChannelAllocation}
                onReset={resetChannelMix}
                isValid={metrics.channelMixValid}
                total={metrics.channelMixTotal}
                message={metrics.channelMixMessage}
                mediaSpend={state.selectedTier.mediaSpend}
              />
            </aside>
          )}

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Sales Funnel */}
            <SalesFunnel
              impressions={metrics.impressions}
              awareness={metrics.awareness}
              consideration={metrics.consideration}
              intent={metrics.intent}
              sales={metrics.displaySales}
            />

            {/* Market Cards */}
            <MarketCards markets={metrics.marketMetrics} />

            {/* Wave Timeline */}
            <WaveTimeline
              selectedWave={state.selectedWave}
              onSelectWave={setSelectedWave}
            />

            {/* Creator ROI */}
            <CreatorROI />

            {/* Under the Hood */}
            {!state.isPresentationMode && (
              <UnderTheHood
                funnelAssumptions={state.funnelAssumptions}
                onUpdateFunnelAssumption={updateFunnelAssumption}
                onResetFunnelAssumptions={resetFunnelAssumptions}
              />
            )}
          </div>

          {/* Right Sidebar - Metrics */}
          <aside className="space-y-6">
            <ForecastModeToggle
              mode={state.forecastMode}
              onModeChange={setForecastMode}
            />

            <MetricsSidebar
              metrics={metrics}
              budgetTier={state.selectedTier}
            />

            {!state.isPresentationMode && (
              <AIAssessment
                channelMix={state.channelMix}
                onApplySuggestions={setChannelMix}
              />
            )}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1800px] mx-auto px-4 py-6 text-center text-sm text-gray-400">
        <p>
          Disney Darlings Sales Forecast Dashboard &bull; Built with{' '}
          <span className="text-primary-pink">♥</span> by{' '}
          <span className="font-medium text-gray-500">ralph</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
