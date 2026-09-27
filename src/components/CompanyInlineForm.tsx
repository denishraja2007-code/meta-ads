import React, { useState, useEffect } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Check,
  BarChart2,
  Send,
} from 'lucide-react';
import { CompanyDetails, TimePeriod, TrackOption } from '../types';
import { validateCompanyForm, ValidationErrors, normalizeUrl } from '../utils/validation';

interface CompanyInlineFormProps {
  formNumber: 1 | 2;
  title: string;
  subtitle: string;
  defaultTrack: TrackOption | string;
  initialDetails?: CompanyDetails | null;
  includeTimePeriod?: boolean;
  selectedTimePeriod?: TimePeriod;
  onTimePeriodChange?: (period: TimePeriod) => void;
  // For Form 1: only Submit
  onSubmitOnly?: (details: CompanyDetails) => void;
  // For Form 2: Submit and Generate buttons
  onSubmitSecond?: (details: CompanyDetails) => void;
  onGenerateComparison?: (details: CompanyDetails) => void;
  isSubmitted?: boolean;
  onEdit?: () => void;
  hasSavedData?: boolean;
  onResetSavedData?: () => void;
  isGenerating?: boolean;
}

const TRACK_OPTIONS: TrackOption[] = ['Textile', 'Shoes', 'Business', 'Hotel', 'Others'];

const TIME_PERIODS: { id: TimePeriod; label: string; desc: string }[] = [
  { id: 'Today', label: 'Today', desc: 'Real-time 24h pulse' },
  { id: 'Last Week', label: 'Last Week', desc: '7-day rolling window' },
  { id: 'Monthly', label: 'Monthly', desc: '30-day view' },
  { id: 'Annual', label: 'Annual', desc: '12-month trajectory' },
];

export const CompanyInlineForm: React.FC<CompanyInlineFormProps> = ({
  formNumber,
  title,
  subtitle,
  defaultTrack,
  initialDetails,
  includeTimePeriod = false,
  selectedTimePeriod = 'Monthly',
  onTimePeriodChange,
  onSubmitOnly,
  onSubmitSecond,
  onGenerateComparison,
  isSubmitted = false,
  onEdit,
  hasSavedData = false,
  onResetSavedData,
  isGenerating = false,
}) => {
  const [formData, setFormData] = useState<CompanyDetails>({
    companyName: initialDetails?.companyName || '',
    track: initialDetails?.track || defaultTrack || 'Business',
    instagramUrl: initialDetails?.instagramUrl || '',
    facebookUrl: initialDetails?.facebookUrl || '',
    websiteUrl: initialDetails?.websiteUrl || '',
    linkedinUrl: initialDetails?.linkedinUrl || '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialDetails) {
      setFormData({
        companyName: initialDetails.companyName || '',
        track: initialDetails.track || defaultTrack || 'Business',
        instagramUrl: initialDetails.instagramUrl || '',
        facebookUrl: initialDetails.facebookUrl || '',
        websiteUrl: initialDetails.websiteUrl || '',
        linkedinUrl: initialDetails.linkedinUrl || '',
      });
    }
  }, [initialDetails, defaultTrack]);

  const handleChange = (field: keyof CompanyDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldErrors = validateCompanyForm({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleBlur = (field: keyof CompanyDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateCompanyForm(formData);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const validateAndGetSanitized = (): CompanyDetails | null => {
    const validationErrors = validateCompanyForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        companyName: true,
        track: true,
        instagramUrl: true,
        facebookUrl: true,
        websiteUrl: true,
        linkedinUrl: true,
      });
      return null;
    }

    return {
      companyName: formData.companyName.trim(),
      track: formData.track,
      instagramUrl: normalizeUrl(formData.instagramUrl),
      facebookUrl: normalizeUrl(formData.facebookUrl),
      websiteUrl: normalizeUrl(formData.websiteUrl),
      linkedinUrl: normalizeUrl(formData.linkedinUrl),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = validateAndGetSanitized();
    if (!sanitized) return;

    if (formNumber === 1 && onSubmitOnly) {
      onSubmitOnly(sanitized);
    } else if (formNumber === 2 && onSubmitSecond) {
      onSubmitSecond(sanitized);
    }
  };

  const handleGenerateClick = () => {
    const sanitized = validateAndGetSanitized();
    if (!sanitized) return;

    if (onGenerateComparison) {
      onGenerateComparison(sanitized);
    }
  };

  const autofillDemoData = () => {
    if (formNumber === 1) {
      setFormData({
        companyName: 'AeroStride Athletics',
        track: defaultTrack || 'Shoes',
        instagramUrl: 'https://instagram.com/aerostride',
        facebookUrl: 'https://facebook.com/aerostride',
        websiteUrl: 'https://aerostride.io',
        linkedinUrl: 'https://linkedin.com/company/aerostride',
      });
    } else {
      setFormData({
        companyName: 'Apex Footwear Co.',
        track: defaultTrack || 'Shoes',
        instagramUrl: 'https://instagram.com/apexfootwear',
        facebookUrl: 'https://facebook.com/apexfootwear',
        websiteUrl: 'https://apexfootwear.com',
        linkedinUrl: 'https://linkedin.com/company/apexfootwear',
      });
    }
    setErrors({});
  };

  // If submitted and collapsed view is requested
  if (isSubmitted && onEdit) {
    return (
      <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400 font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-indigo-400 uppercase">
                  Company {formNumber}
                </span>
                <span className="text-sm sm:text-base font-bold text-white">
                  {formData.companyName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  {formData.track}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                {formData.websiteUrl} · {formData.instagramUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Details Submitted</span>
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700 transition-colors"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div>
          <div className="text-[11px] font-mono tracking-wider text-indigo-400 uppercase">
            {formNumber === 1 ? 'Step 02 / Primary Brand' : 'Step 03 / Competitor Brand'}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="text-rose-400 text-sm">*</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasSavedData && formNumber === 1 && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3 h-3" />
              <span>Auto-populated from saved data</span>
              {onResetSavedData && (
                <button
                  type="button"
                  onClick={onResetSavedData}
                  className="ml-1 text-slate-400 hover:text-rose-400"
                  title="Clear saved data"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={autofillDemoData}
            className="text-xs text-indigo-300 hover:text-white px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sample details</span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Company Name & Track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Company Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              onBlur={() => handleBlur('companyName')}
              placeholder={formNumber === 1 ? 'e.g. Nike, Puma, Apple' : 'e.g. Adidas, Under Armour, Sony'}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.companyName && touched.companyName
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.companyName && touched.companyName && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.companyName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Track <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.track}
              onChange={(e) => handleChange('track', e.target.value)}
              onBlur={() => handleBlur('track')}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a19] border text-sm text-white focus:outline-none focus:ring-1 transition-all ${
                errors.track && touched.track
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            >
              {TRACK_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#0f1125] text-white">
                  {opt}
                </option>
              ))}
            </select>
            {errors.track && touched.track && (
              <p className="mt-1 text-xs text-rose-400">{errors.track}</p>
            )}
          </div>
        </div>

        {/* Row 2: Instagram URL & Facebook URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Instagram URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">instagram.com/...</span>
            </div>
            <input
              type="text"
              value={formData.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              onBlur={() => handleBlur('instagramUrl')}
              placeholder="https://instagram.com/company"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.instagramUrl && touched.instagramUrl
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.instagramUrl && touched.instagramUrl && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.instagramUrl}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Facebook URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">facebook.com/...</span>
            </div>
            <input
              type="text"
              value={formData.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              onBlur={() => handleBlur('facebookUrl')}
              placeholder="https://facebook.com/company"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.facebookUrl && touched.facebookUrl
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.facebookUrl && touched.facebookUrl && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.facebookUrl}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Official Website URL & LinkedIn URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Official Website URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">company.com</span>
            </div>
            <input
              type="text"
              value={formData.websiteUrl}
              onChange={(e) => handleChange('websiteUrl', e.target.value)}
              onBlur={() => handleBlur('websiteUrl')}
              placeholder="https://company.com"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.websiteUrl && touched.websiteUrl
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.websiteUrl && touched.websiteUrl && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.websiteUrl}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                LinkedIn URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">linkedin.com/company/...</span>
            </div>
            <input
              type="text"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              onBlur={() => handleBlur('linkedinUrl')}
              placeholder="https://linkedin.com/company/company"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a19] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.linkedinUrl && touched.linkedinUrl
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.linkedinUrl && touched.linkedinUrl && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.linkedinUrl}
              </p>
            )}
          </div>
        </div>

        {/* Time Period selector (if requested for primary company) */}
        {includeTimePeriod && onTimePeriodChange && (
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Select Time Period</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TIME_PERIODS.map((period) => {
                const isSelected = selectedTimePeriod === period.id;
                return (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => onTimePeriodChange(period.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#1b1e42] to-[#141633] border-indigo-500 text-white shadow-md shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                        : 'bg-[#090b1c] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{period.label}</span>
                      <span
                        className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-500'
                            : 'border-slate-700 bg-transparent'
                        }`}
                      >
                        {isSelected && <span className="w-1 h-1 rounded-full bg-white" />}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">{period.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons area */}
        <div className="pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {formNumber === 1
              ? 'Click Submit to confirm company details before choosing competitor options.'
              : 'Submit to save details, or Generate to view side-by-side comparison.'}
          </div>

          {/* Form 1: Show ONLY the Submit button as strictly requested */}
          {formNumber === 1 && (
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-900/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          )}

          {/* Form 2: Show Submit and Generate buttons as strictly requested */}
          {formNumber === 2 && (
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#141634] hover:bg-[#1c2049] border border-slate-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Submit</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-900/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BarChart2 className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Comparison...' : 'Generate'}</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
