import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Smile,
  Globe,
  Share2,
  ExternalLink,
  Filter,
  Check,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  IntelligenceResult,
  TimePeriod,
} from '../types';

interface Step3ResultsProps {
  data: IntelligenceResult | null;
  isLoading: boolean;
  isEmptyState: boolean;
  onToggleEmptyState?: () => void;
  onResetFilters: () => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
}

export const Step3Results: React.FC<Step3ResultsProps> = ({
  data,
  isLoading,
  isEmptyState,
  onToggleEmptyState,
  onResetFilters,
  timePeriod,
  onTimePeriodChange,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full animate-in fade-in duration-200">
        <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-xl shadow-black/40 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              Synthesizing Market Intelligence...
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Scanning social indexes, organic engagement curves, and domain traffic indicators for {timePeriod} horizon.
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-slate-800/40 border border-slate-800 animate-pulse flex flex-col justify-center p-3 gap-2"
              >
                <div className="h-3 w-1/2 bg-slate-700/60 rounded" />
                <div className="h-5 w-3/4 bg-slate-700/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state handling
  if (isEmptyState || !data) {
    return (
      <section className="w-full animate-in fade-in duration-200">
        <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-xl shadow-black/40 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Info className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white">No Intelligence Data Found</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We couldn't retrieve intelligence records for this specific combination of location and industry track during the selected timeframe.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Modify Location or Track</span>
            </button>

            {onToggleEmptyState && (
              <button
                type="button"
                onClick={onToggleEmptyState}
                className="px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Reload Real Data
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  const { summary, platformBreakdown, highlights, company } = data;

  const filteredPlatforms =
    selectedPlatform === 'all'
      ? platformBreakdown
      : platformBreakdown.filter((p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase());

  return (
    <section className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Test empty state toggle banner */}
      {onToggleEmptyState && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#0e1026] border border-slate-800 text-[11px] text-slate-400">
          <span>Active filter: {data.location} ({data.locationName}) · {data.track} · {timePeriod}</span>
          <button
            type="button"
            onClick={onToggleEmptyState}
            className="text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
          >
            Simulate Empty State
          </button>
        </div>
      )}

      {/* Main Analysis Container */}
      <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 space-y-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider text-indigo-400 uppercase">
              Single Company Intelligence Output
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>{company.companyName} Performance Analysis</span>
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                Live Data
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Evaluated across {data.locationName} for {data.track} industry. Updated at {data.generatedAt}.
            </p>
          </div>

          {/* Quick Time Period switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#090b1c] rounded-xl border border-slate-800 self-start md:self-auto">
            {(['Today', 'Last Week', 'Monthly', 'Annual'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onTimePeriodChange(period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  timePeriod === period
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Key KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#0c0e22] border border-slate-800/90 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Total Audience</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {summary.totalAudience}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>+12.4% vs prev</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0e22] border border-slate-800/90 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
              <span>Engagement Rate</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {summary.avgEngagement}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Industry avg: 3.1%</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0e22] border border-slate-800/90 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Website Visits</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {summary.webVisits}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">+8.3% trajectory</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0e22] border border-slate-800/90 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>Sentiment Score</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {summary.sentimentScore}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Audience trust</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0e22] border border-slate-800/90 space-y-1 col-span-2 md:col-span-1">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Share of Voice</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {summary.shareOfVoice}
            </div>
            <div className="text-[11px] text-indigo-400 font-mono">Rank #2 in territory</div>
          </div>
        </div>

        {/* Platform Breakdown Cards */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Channel Breakdown & Social Metrics
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              {['all', 'instagram', 'facebook', 'website', 'linkedin'].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedPlatform === plat
                      ? 'bg-slate-700 text-white font-medium'
                      : 'text-slate-400 hover:text-white bg-[#0e1024]'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPlatforms.map((metric) => {
              const platformDotColors: Record<string, string> = {
                Instagram: 'bg-pink-500',
                Facebook: 'bg-blue-500',
                Website: 'bg-emerald-500',
                LinkedIn: 'bg-indigo-500',
              };

              return (
                <div
                  key={metric.platform}
                  className="p-4 rounded-xl bg-[#0c0e22] border border-slate-800/90 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${platformDotColors[metric.platform] || 'bg-indigo-500'}`} />
                      <span className="text-xs font-semibold text-white">{metric.platform}</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">{metric.growth}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Followers / Users:</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-200">
                        {metric.followersOrVisitors}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400">
                      <span>Engagement:</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-200">
                        {metric.engagementRate}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400">
                      <span>Activity:</span>
                      <span className="text-slate-300 truncate max-w-[120px] text-right">
                        {metric.postsOrUpdates}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/50 flex justify-between items-center">
                      <span className="text-[11px] text-slate-500">{metric.topMetricLabel}:</span>
                      <span className="text-[11px] font-mono font-bold text-indigo-300">
                        {metric.topMetricValue}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights: Strengths & Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#0c0e22] border border-emerald-900/30 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Competitive Strengths</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {highlights.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 text-sm leading-none">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0e22] border border-indigo-900/30 space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Growth Opportunities</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {highlights.opportunities.map((o, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 text-sm leading-none">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
