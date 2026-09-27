import React, { useState, useEffect } from 'react';
import { X, Building2, Globe, Sparkles, Check, AlertCircle } from 'lucide-react';
import { CompanyDetails, TrackOption } from '../types';
import { validateCompanyForm, ValidationErrors, normalizeUrl } from '../utils/validation';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: CompanyDetails) => void;
  initialDetails?: CompanyDetails | null;
  mode: 'our' | 'competitor';
  title?: string;
  defaultTrack?: TrackOption | string;
  hasSavedDataNotice?: boolean;
}

const TRACK_OPTIONS: TrackOption[] = ['Textile', 'Shoes', 'Business', 'Hotel', 'Others'];

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDetails,
  mode,
  title,
  defaultTrack = 'Business',
  hasSavedDataNotice = false,
}) => {
  const [formData, setFormData] = useState<CompanyDetails>({
    companyName: '',
    track: defaultTrack || 'Business',
    instagramUrl: '',
    facebookUrl: '',
    websiteUrl: '',
    linkedinUrl: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialDetails) {
        setFormData({
          companyName: initialDetails.companyName || '',
          track: initialDetails.track || defaultTrack || 'Business',
          instagramUrl: initialDetails.instagramUrl || '',
          facebookUrl: initialDetails.facebookUrl || '',
          websiteUrl: initialDetails.websiteUrl || '',
          linkedinUrl: initialDetails.linkedinUrl || '',
        });
      } else {
        setFormData({
          companyName: '',
          track: defaultTrack || 'Business',
          instagramUrl: '',
          facebookUrl: '',
          websiteUrl: '',
          linkedinUrl: '',
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, initialDetails, defaultTrack]);

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      return;
    }

    // Normalize URLs
    const sanitized: CompanyDetails = {
      companyName: formData.companyName.trim(),
      track: formData.track,
      instagramUrl: normalizeUrl(formData.instagramUrl),
      facebookUrl: normalizeUrl(formData.facebookUrl),
      websiteUrl: normalizeUrl(formData.websiteUrl),
      linkedinUrl: normalizeUrl(formData.linkedinUrl),
    };

    onSave(sanitized);
    onClose();
  };

  const autofillDemoData = () => {
    if (mode === 'our') {
      const demo: CompanyDetails = {
        companyName: 'AeroStride Athletics',
        track: defaultTrack || 'Shoes',
        instagramUrl: 'https://instagram.com/aerostride',
        facebookUrl: 'https://facebook.com/aerostride',
        websiteUrl: 'https://aerostride.io',
        linkedinUrl: 'https://linkedin.com/company/aerostride',
      };
      setFormData(demo);
    } else {
      const demoCompetitors: CompanyDetails[] = [
        {
          companyName: 'Apex Footwear Co.',
          track: defaultTrack || 'Shoes',
          instagramUrl: 'https://instagram.com/apexfootwear',
          facebookUrl: 'https://facebook.com/apexfootwear',
          websiteUrl: 'https://apexfootwear.com',
          linkedinUrl: 'https://linkedin.com/company/apexfootwear',
        },
        {
          companyName: 'Vanguard Textiles',
          track: defaultTrack || 'Textile',
          instagramUrl: 'https://instagram.com/vanguardtextiles',
          facebookUrl: 'https://facebook.com/vanguardtextiles',
          websiteUrl: 'https://vanguardtextiles.com',
          linkedinUrl: 'https://linkedin.com/company/vanguardtextiles',
        },
      ];
      setFormData(demoCompetitors[Math.floor(Math.random() * demoCompetitors.length)]);
    }
    setErrors({});
  };

  const modalTitle =
    title ||
    (mode === 'our'
      ? initialDetails?.companyName
        ? 'Update Our Company Details'
        : 'Enter Our Company Details'
      : 'Add Competitor Company');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl bg-[#0f1125] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between bg-[#131530]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-headline" className="text-base font-semibold text-white">
                {modalTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'our'
                  ? 'All profile URLs will be used for benchmark analytics'
                  : 'Add competitor profile URLs to run head-to-head comparison'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={autofillDemoData}
              className="text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center gap-1.5 transition-colors"
              title="Populate sample URLs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample data</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saved data indicator badge */}
        {hasSavedDataNotice && mode === 'our' && (
          <div className="px-6 py-2 bg-indigo-950/40 border-b border-indigo-900/40 flex items-center gap-2 text-xs text-indigo-300">
            <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Previously saved company profile was auto-populated. You can review or edit below.</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Row 1: Name and Track */}
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
                placeholder="e.g. Nike, Puma, Hilton"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a18] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
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
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a18] border text-sm text-white focus:outline-none focus:ring-1 transition-all ${
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

          {/* Instagram URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Instagram URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">e.g. instagram.com/company</span>
            </div>
            <input
              type="text"
              value={formData.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              onBlur={() => handleBlur('instagramUrl')}
              placeholder="https://instagram.com/yourbrand"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a18] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
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

          {/* Facebook URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Facebook URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">e.g. facebook.com/company</span>
            </div>
            <input
              type="text"
              value={formData.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              onBlur={() => handleBlur('facebookUrl')}
              placeholder="https://facebook.com/yourbrand"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a18] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
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

          {/* Official Website URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Official Website URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">e.g. company.com</span>
            </div>
            <input
              type="text"
              value={formData.websiteUrl}
              onChange={(e) => handleChange('websiteUrl', e.target.value)}
              onBlur={() => handleBlur('websiteUrl')}
              placeholder="https://yourbrand.com"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a18] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
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

          {/* LinkedIn URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                LinkedIn URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">e.g. linkedin.com/company/company</span>
            </div>
            <input
              type="text"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              onBlur={() => handleBlur('linkedinUrl')}
              placeholder="https://linkedin.com/company/yourbrand"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#090a18] border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
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

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-md shadow-indigo-700/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{mode === 'our' ? 'Save Company Details' : 'Add Competitor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
