import React, { useState } from 'react';
import { MapPin, Layers, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { LocationOption, TrackOption } from '../types';

interface Step1ScopeProps {
  initialLocation?: LocationOption | '';
  initialLocationName?: string;
  initialTrack?: TrackOption | '';
  onSubmit: (location: LocationOption, locationName: string, track: TrackOption) => void;
}

const LOCATION_OPTIONS: { id: LocationOption; label: string; desc: string }[] = [
  { id: 'Country', label: 'Country', desc: 'Nationwide market coverage' },
  { id: 'State', label: 'State', desc: 'State-level or provincial market' },
  { id: 'District', label: 'District', desc: 'Metropolitan district or county' },
  { id: 'Region', label: 'Region', desc: 'Multi-territory or global region' },
];

const TRACK_OPTIONS: { id: TrackOption; label: string; desc: string }[] = [
  { id: 'Textile', label: 'Textile', desc: 'Fabrics, apparel & garment production' },
  { id: 'Shoes', label: 'Shoes', desc: 'Footwear, athletic & fashion shoes' },
  { id: 'Business', label: 'Business', desc: 'B2B enterprise, consulting & tech' },
  { id: 'Hotel', label: 'Hotel', desc: 'Hospitality, resorts & lodging' },
  { id: 'Others', label: 'Others', desc: 'Diversified commercial verticals' },
];

export const Step1Scope: React.FC<Step1ScopeProps> = ({
  initialLocation = '',
  initialLocationName = '',
  initialTrack = '',
  onSubmit,
}) => {
  const [location, setLocation] = useState<LocationOption | ''>(initialLocation);
  const [locationName, setLocationName] = useState<string>(initialLocationName);
  const [track, setTrack] = useState<TrackOption | ''>(initialTrack);

  const [errors, setErrors] = useState<{ location?: string; track?: string }>({});
  const [touched, setTouched] = useState<{ location?: boolean; track?: boolean }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { location?: string; track?: string } = {};

    if (!location) {
      newErrors.location = 'Please select a location scope (required).';
    }
    if (!track) {
      newErrors.track = 'Please select an industry track (required).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ location: true, track: true });
      return;
    }

    onSubmit(location as LocationOption, locationName.trim() || `${location} Scope`, track as TrackOption);
  };

  const handleQuickDemo = () => {
    setLocation('Country');
    setLocationName('United States');
    setTrack('Shoes');
    setErrors({});
  };

  return (
    <section className="w-full">
      <div className="bg-[#111328]/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40">
        {/* Section title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-3">
          <div>
            <div className="text-[11px] font-mono tracking-wider text-indigo-400 uppercase">
              Step 01 / Setup Scope
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Select Market Location & Track
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Specify your geographic boundary and target industry vertical to compare accurately.
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-xs font-medium text-indigo-300 hover:text-white hover:bg-indigo-900/50 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset demo (USA / Shoes)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Select Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>1. Select Location</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">Required</span>
              </div>

              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value as LocationOption);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
                className={`w-full px-4 py-3 rounded-xl bg-[#090a19] border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.location && touched.location
                    ? 'border-rose-500/80 focus:ring-rose-500/30'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              >
                <option value="" disabled className="bg-[#0f1125] text-slate-400">
                  Choose location scope (Country, State, District, Region)...
                </option>
                {LOCATION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0f1125] text-white">
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>

              {errors.location && touched.location && (
                <p className="text-xs text-rose-400 flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.location}
                </p>
              )}

              {/* Optional specific location identifier */}
              {location && (
                <div className="pt-2 animate-in fade-in duration-150">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Specific {location} Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder={
                      location === 'Country'
                        ? 'e.g. United States, Germany, Japan'
                        : location === 'State'
                        ? 'e.g. California, Bavaria, Ontario'
                        : location === 'District'
                        ? 'e.g. Downtown Metro, South District'
                        : 'e.g. North America, EMEA, APAC'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#090a19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* 2. Select Track */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>2. Select Track</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">Required</span>
              </div>

              <select
                value={track}
                onChange={(e) => {
                  setTrack(e.target.value as TrackOption);
                  if (errors.track) setErrors((prev) => ({ ...prev, track: undefined }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, track: true }))}
                className={`w-full px-4 py-3 rounded-xl bg-[#090a19] border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.track && touched.track
                    ? 'border-rose-500/80 focus:ring-rose-500/30'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              >
                <option value="" disabled className="bg-[#0f1125] text-slate-400">
                  Choose track (Textile, Shoes, Business, Hotel, Others)...
                </option>
                {TRACK_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0f1125] text-white">
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>

              {errors.track && touched.track && (
                <p className="text-xs text-rose-400 flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.track}
                </p>
              )}

              {track && (
                <div className="pt-2 text-[11px] text-slate-400 bg-[#0c0e22] px-3.5 py-2 rounded-xl border border-slate-800/80">
                  <span className="text-indigo-400 font-medium">{track}</span> analytics models will analyze social metrics, conversion signals, and search volume in your scope.
                </div>
              )}
            </div>
          </div>

          {/* 3. Submit button */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
            <div className="text-xs text-slate-500 hidden sm:block">
              Both Location and Track are required before continuing to Company Details.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Submit & Proceed to Company Setup</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
