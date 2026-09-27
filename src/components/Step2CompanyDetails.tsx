import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Edit3,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { CompanyDetails, LocationOption, TimePeriod, TrackOption } from '../types';

interface Step2CompanyDetailsProps {
  location: LocationOption;
  locationName: string;
  track: TrackOption | string;
  companyDetails: CompanyDetails | null;
  onOpenCompanyModal: () => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  onSubmit: () => void;
  onBackToScope: () => void;
  onClearSavedCompany?: () => void;
  hasSavedData: boolean;
}

const TIME_PERIODS: { id: TimePeriod; label: string; desc: string }[] = [
  { id: 'Today', label: 'Today', desc: 'Real-time 24h pulse' },
  { id: 'Last Week', label: 'Last Week', desc: '7-day rolling window' },
  { id: 'Monthly', label: 'Monthly', desc: '30-day benchmark' },
  { id: 'Annual', label: 'Annual', desc: '12-month trajectory' },
];

export const Step2CompanyDetails: React.FC<Step2CompanyDetailsProps> = ({
  location,
  locationName,
  track,
  companyDetails,
  onOpenCompanyModal,
  timePeriod,
  onTimePeriodChange,
  onSubmit,
  onBackToScope,
  onClearSavedCompany,
  hasSavedData,
}) => {
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyDetails || !companyDetails.companyName.trim()) {
      setErrorNotice('Please complete "Choose Our Company Details" before generating results.');
      return;
    }
    setErrorNotice(null);
    onSubmit();
  };

  return (
    <section className="w-full">
      <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 space-y-8">
        {/* Scope Context bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Target Scope:</span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 font-medium">
              {location}: {locationName}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 font-medium">
              Track: {track}
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToScope}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Change Scope</span>
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 4. Choose Our Company Details */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] font-mono tracking-wider text-indigo-400 uppercase">
                  Step 02 / Requirement 4
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Choose Our Company Details</span>
                  <span className="text-rose-400 text-sm">*</span>
                </h2>
              </div>

              {hasSavedData && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Saved Data Loaded</span>
                  </span>
                  {onClearSavedCompany && (
                    <button
                      type="button"
                      onClick={onClearSavedCompany}
                      className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                      title="Clear saved company details"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Company Card or Setup Button */}
            {!companyDetails ? (
              <div
                onClick={onOpenCompanyModal}
                className="w-full p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-indigo-500 bg-[#0d0f24]/70 hover:bg-[#121533]/80 cursor-pointer transition-all group flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    Click to Enter Our Company Details
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1">
                    Provide your Company Name, Track, Instagram URL, Facebook URL, Official Website URL, and LinkedIn URL.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40 transition-all"
                >
                  Configure Company Details
                </button>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-700/80 bg-[#0c0e22] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-base">
                      {companyDetails.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {companyDetails.companyName}
                        </h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                          {companyDetails.track}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Primary brand profile for benchmark analysis
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenCompanyModal}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                </div>

                {/* Social & Web link pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <a
                    href={companyDetails.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#11132a] border border-slate-800/80 hover:border-pink-500/50 text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                      <span className="text-slate-300 font-medium truncate">Instagram</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-400 shrink-0 ml-1" />
                  </a>

                  <a
                    href={companyDetails.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#11132a] border border-slate-800/80 hover:border-blue-500/50 text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-slate-300 font-medium truncate">Facebook</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-1" />
                  </a>

                  <a
                    href={companyDetails.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#11132a] border border-slate-800/80 hover:border-emerald-500/50 text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-slate-300 font-medium truncate">Official Website</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-1" />
                  </a>

                  <a
                    href={companyDetails.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#11132a] border border-slate-800/80 hover:border-indigo-500/50 text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span className="text-slate-300 font-medium truncate">LinkedIn</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-1" />
                  </a>
                </div>
              </div>
            )}

            {errorNotice && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorNotice}</span>
              </p>
            )}
          </div>

          {/* 5. Select Time Period */}
          <div className="pt-2">
            <div className="mb-3">
              <div className="text-[11px] font-mono tracking-wider text-indigo-400 uppercase">
                Step 02 / Requirement 5
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>Select Time Period</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose the evaluation horizon for social engagement and traffic benchmarks.
              </p>
            </div>

            {/* Single-selection interactive tabs / radio buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TIME_PERIODS.map((period) => {
                const isSelected = timePeriod === period.id;
                return (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => onTimePeriodChange(period.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#1b1e42] to-[#141633] border-indigo-500 text-white shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                        : 'bg-[#090b1c] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-semibold">{period.label}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-500'
                            : 'border-slate-700 bg-transparent'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{period.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Submit button to generate results */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Ready to analyze <strong className="text-slate-200">{timePeriod}</strong> data for{' '}
                <strong className="text-slate-200">{companyDetails?.companyName || 'your company'}</strong>.
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit & Generate Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
