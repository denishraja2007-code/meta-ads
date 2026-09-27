import React from 'react';
import {
  Trophy,
  CheckCircle,
  BarChart3,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { CompanyDetails, CompetitorCompany, ComparisonReport } from '../types';

interface Step4ComparisonProps {
  report: ComparisonReport;
  ourCompany: CompanyDetails;
  secondCompany: CompanyDetails;
  onResetAll?: () => void;
}

export const Step4Comparison: React.FC<Step4ComparisonProps> = ({
  report,
  ourCompany,
  secondCompany,
  onResetAll,
}) => {
  return (
    <section className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider text-indigo-400 uppercase">
              Step 04 / Side-by-Side Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Side-by-Side Competitor Comparison</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-mono">
                {report.timePeriod}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct performance matrix comparing <strong className="text-slate-200">{ourCompany.companyName}</strong> against{' '}
              <strong className="text-slate-200">{secondCompany.companyName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {onResetAll && (
              <button
                type="button"
                onClick={onResetAll}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start New Analysis</span>
              </button>
            )}
          </div>
        </div>

        {/* Competitor Roster Header Badges */}
        <div className="flex flex-wrap gap-3 p-3.5 rounded-xl bg-[#090b1c] border border-slate-800/80 items-center">
          <span className="text-xs text-slate-400 font-medium">Comparing Brands:</span>
          <span className="px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/50 text-indigo-200 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>{ourCompany.companyName} (Company 1)</span>
          </span>
          <span className="px-3 py-1 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>{secondCompany.companyName} (Company 2)</span>
          </span>
        </div>

        {/* Side-by-side comparison table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/90">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0b0c1e] text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold text-slate-300">Metric Indicator</th>
                <th className="py-3.5 px-4 font-semibold text-indigo-400 bg-indigo-950/30 border-x border-indigo-900/30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>{ourCompany.companyName}</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold text-purple-400 bg-purple-950/20">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{secondCompany.companyName}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0d0f22]/60">
              {report.rows.map((row, idx) => {
                const isOurWinner = row.winnerCompanyId === 'our';
                const compIds = Object.keys(row.competitors);
                const compVal = compIds.length > 0 ? row.competitors[compIds[0]] : '—';
                const isCompWinner = !isOurWinner;

                return (
                  <tr key={idx} className="hover:bg-[#12142d]/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-300 flex items-center gap-2">
                      <span>{row.metric}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                        {row.category}
                      </span>
                    </td>

                    {/* Company 1 Value */}
                    <td className="py-3 px-4 font-mono font-bold tabular-nums text-white bg-indigo-950/20 border-x border-indigo-900/20">
                      <div className="flex items-center justify-between">
                        <span>{row.ourValue}</span>
                        {isOurWinner && (
                          <span
                            title="Category leader"
                            className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 flex items-center gap-1"
                          >
                            <Trophy className="w-2.5 h-2.5" />
                            <span>Leader</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Company 2 Value */}
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>{compVal}</span>
                        {isCompWinner && (
                          <span
                            title="Leader in this metric"
                            className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                          >
                            <Trophy className="w-2.5 h-2.5 text-amber-400" />
                            <span>Leader</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Channel Strength Comparison Progress Bars */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Channel Dominance Index (0-100)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.channelScores.map((channel) => {
              const compIds = Object.keys(channel.competitorScores);
              const compScore = compIds.length > 0 ? channel.competitorScores[compIds[0]] : 70;

              return (
                <div
                  key={channel.platform}
                  className="p-4 rounded-xl bg-[#0c0e22] border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{channel.platform}</span>
                    <span className="text-[11px] font-mono text-indigo-300 font-bold">
                      {channel.ourScore} vs {compScore}
                    </span>
                  </div>

                  {/* Company 1 bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span className="text-indigo-400 font-medium">{ourCompany.companyName}</span>
                      <span className="font-mono">{channel.ourScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${channel.ourScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Company 2 bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span className="text-purple-400 font-medium">{secondCompany.companyName}</span>
                      <span className="font-mono">{compScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${compScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Takeaways */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#12142d] to-[#161838] border border-indigo-900/40 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Strategic Takeaways & Comparative Advantage
            </h4>
          </div>
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            {report.competitiveTakeaways.map((takeaway, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">0{idx + 1}.</span>
                <span>{takeaway}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
