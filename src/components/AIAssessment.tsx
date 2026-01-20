import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import type { ChannelMix } from '../utils/calculations';
import { formatPercent } from '../utils/formatters';

interface AIAssessmentProps {
  channelMix: ChannelMix;
  metrics: {
    impressions: number;
    salesLow: number;
    salesHigh: number;
    roas: number;
  };
  onApplySuggestions: (newMix: ChannelMix) => void;
}

interface Optimization {
  priority: 'high' | 'medium' | 'low';
  channel: string;
  channelName: string;
  currentAllocation: number;
  suggestedAllocation: number;
  rationale: string;
  expectedImpact: string;
}

interface Assessment {
  rating: 'Optimal' | 'Strong' | 'Acceptable' | 'Needs Adjustment';
  stars: number;
  summary: string;
  optimizations: Optimization[];
  keyInsight: string;
}

// Fallback assessment when API fails
function generateFallbackAssessment(channelMix: ChannelMix): Assessment {
  const retailAllocation = channelMix.retail || 0;
  const creatorsAllocation = channelMix.creators || 0;
  const tvAllocation = channelMix.tv || 0;
  const bottomFunnel = retailAllocation + creatorsAllocation;
  const topFunnel = (channelMix.tv || 0) + (channelMix.ctv || 0) + (channelMix.ooh || 0);

  const optimizations: Optimization[] = [];

  if (retailAllocation < 0.15 && creatorsAllocation > 0.10) {
    optimizations.push({
      priority: 'high',
      channel: 'retail',
      channelName: 'Retail DSP',
      currentAllocation: retailAllocation,
      suggestedAllocation: 0.15,
      rationale: "With a €45-55 price point and European parents' evidence-driven purchasing behavior, bottom-funnel channels show 1.8x higher conversion efficiency.",
      expectedImpact: '+8% projected sales, +0.2x ROAS'
    });
  }

  if (tvAllocation > 0.15) {
    optimizations.push({
      priority: 'medium',
      channel: 'tv',
      channelName: 'TV',
      currentAllocation: tvAllocation,
      suggestedAllocation: 0.10,
      rationale: "Linear TV CPM ($155.25) is 23x higher than Meta. Consider shifting to CTV for similar reach with better targeting.",
      expectedImpact: '+15% impression efficiency'
    });
  }

  if (channelMix.tiktok > 0.12) {
    optimizations.push({
      priority: 'low',
      channel: 'tiktok',
      channelName: 'TikTok',
      currentAllocation: channelMix.tiktok,
      suggestedAllocation: 0.08,
      rationale: "TikTok conversion index (0.9x) is below average. Reallocate to Creators for better alignment with 'Real Reactions' strategy.",
      expectedImpact: '+5% conversion rate'
    });
  }

  let rating: Assessment['rating'];
  let stars: number;

  if (optimizations.length === 0) {
    rating = 'Optimal';
    stars = 5;
  } else if (optimizations.filter(o => o.priority === 'high').length === 0) {
    rating = 'Strong';
    stars = 4;
  } else if (optimizations.length <= 2) {
    rating = 'Acceptable';
    stars = 3;
  } else {
    rating = 'Needs Adjustment';
    stars = 2;
  }

  const summaryParts = [];
  if (bottomFunnel > 0.35) {
    summaryParts.push("Your conversion-focused allocation aligns well with the 'Real Reactions' strategy.");
  } else if (topFunnel > 0.45) {
    summaryParts.push("Strong awareness investment will build brand equity across EU3.");
  } else {
    summaryParts.push("Balanced allocation provides flexibility to optimize based on early results.");
  }

  if (creatorsAllocation >= 0.15) {
    summaryParts.push("Creator-heavy approach supports authentic proof-building.");
  }

  return {
    rating,
    stars,
    summary: summaryParts.join(' '),
    optimizations,
    keyInsight: bottomFunnel > 0.30
      ? "Your mix leverages the insight that European parents buy on evidence - strong alignment with campaign goals."
      : "Consider shifting more budget to bottom-funnel channels to capitalize on the 'evidence-driven' European parent behavior."
  };
}

export function AIAssessment({ channelMix, metrics, onApplySuggestions }: AIAssessmentProps) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);

  const fetchAssessment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelMix, metrics })
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      if (data.fallback) throw new Error('Fallback requested');

      setAssessment(data);
      setIsAI(true);
    } catch {
      // Use fallback assessment
      setAssessment(generateFallbackAssessment(channelMix));
      setIsAI(false);
    } finally {
      setLoading(false);
    }
  }, [channelMix, metrics]);

  // Initial load
  useEffect(() => {
    setAssessment(generateFallbackAssessment(channelMix));
    setIsAI(false);
  }, [channelMix]);

  const handleApplySuggestions = () => {
    if (!assessment) return;

    const newMix = { ...channelMix };
    assessment.optimizations.forEach(opt => {
      const diff = opt.suggestedAllocation - opt.currentAllocation;
      newMix[opt.channel] = opt.suggestedAllocation;
      const otherChannels = Object.keys(newMix).filter(k => k !== opt.channel);
      const otherTotal = otherChannels.reduce((sum, k) => sum + newMix[k], 0);
      if (otherTotal > 0) {
        otherChannels.forEach(k => {
          newMix[k] = newMix[k] - (diff * (newMix[k] / otherTotal));
        });
      }
    });
    onApplySuggestions(newMix);
  };

  const ratingColors = {
    'Optimal': 'text-green-600',
    'Strong': 'text-blue-600',
    'Acceptable': 'text-amber-600',
    'Needs Adjustment': 'text-red-600'
  };

  if (!assessment) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {isAI ? 'AI Strategy Assessment' : 'Strategy Assessment'}
          </h3>
        </div>
        <button
          onClick={fetchAssessment}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 disabled:opacity-50"
          title="Get AI-powered assessment"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {loading ? 'Analyzing...' : 'Ask AI'}
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${ratingColors[assessment.rating]}`}>
            {assessment.rating}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Sparkles
              key={i}
              className={`w-4 h-4 ${i < assessment.stars ? 'text-yellow-400' : 'text-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-4">
        {assessment.summary}
      </p>

      {/* Optimizations */}
      {assessment.optimizations.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Suggested Optimizations</p>
          {assessment.optimizations.map((opt, index) => (
            <motion.div
              key={opt.channel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${
                opt.priority === 'high' ? 'border-amber-200 bg-amber-50' :
                opt.priority === 'medium' ? 'border-blue-200 bg-blue-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-dark">{opt.channelName}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">{formatPercent(opt.currentAllocation)}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span className="font-medium text-primary-pink">{formatPercent(opt.suggestedAllocation)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{opt.rationale}</p>
              <p className="text-xs font-medium text-green-600">{opt.expectedImpact}</p>
            </motion.div>
          ))}

          <button
            onClick={handleApplySuggestions}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-pink text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="w-4 h-4" />
            Apply Suggestions
          </button>
        </div>
      )}

      {/* Key Insight */}
      <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-xs font-semibold text-purple-700 mb-1">Key Insight</p>
        <p className="text-sm text-purple-600">{assessment.keyInsight}</p>
      </div>
    </div>
  );
}
