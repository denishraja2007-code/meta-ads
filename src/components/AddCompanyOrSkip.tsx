import React from 'react';
import { Plus, SkipForward, Users, Sparkles, Building2, ArrowDown } from 'lucide-react';

interface AddCompanyOrSkipProps {
  onAddCompany: () => void;
  onSkip: () => void;
  firstCompanyName: string;
  hasSecondCompany: boolean;
  isSkipped: boolean;
  isLoadingSkip?: boolean;
}

export const AddCompanyOrSkip: React.FC<AddCompanyOrSkipProps> = ({
  onAddCompany,
  onSkip,
  firstCompanyName,
  hasSecondCompany,
  isSkipped,
  isLoadingSkip = false,
}) => {
  return (
    <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="text-[11px] font-mono tracking-wider text-indigo-400 uppercase">
            Step 03 / Competitor Option
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Compare with Another Brand or Proceed?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Choose whether to add a second competitor company for comparison, or skip directly to view <strong className="text-slate-200">{firstCompanyName}</strong>'s results.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Choice</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option A: Add Company */}
        <button
          type="button"
          onClick={onAddCompany}
          className={`p-5 rounded-2xl border-2 text-left transition-all relative group cursor-pointer flex flex-col justify-between ${
            hasSecondCompany
              ? 'bg-[#151838] border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950/50'
              : 'bg-[#0c0e22] border-slate-800 hover:border-indigo-500/70 hover:bg-[#121431]'
          }`}
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Add Company
                </span>
                {hasSecondCompany && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-900 text-indigo-300">
                    Form Open
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Enter details for a second company to generate a side-by-side comparison report.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
            <span>Enter second company form</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>

        {/* Option B: Skip */}
        <button
          type="button"
          onClick={onSkip}
          disabled={isLoadingSkip}
          className={`p-5 rounded-2xl border-2 text-left transition-all relative group cursor-pointer flex flex-col justify-between ${
            isSkipped && !hasSecondCompany
              ? 'bg-[#151838] border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/30'
              : 'bg-[#0c0e22] border-slate-800 hover:border-slate-600 hover:bg-[#121431]'
          }`}
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform">
              <SkipForward className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white group-hover:text-slate-200 transition-colors">
                  Skip
                </span>
                {isSkipped && !hasSecondCompany && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    Report Generated
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Skip competitor addition and generate performance results for {firstCompanyName} alone.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover:text-white">
            <span>{isLoadingSkip ? 'Generating Report...' : `Generate ${firstCompanyName} Report`}</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};
