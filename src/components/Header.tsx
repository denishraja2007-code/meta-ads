import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  onHome?: () => void;
  canGoBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBack, onHome, canGoBack = true }) => {
  return (
    <div className="w-full">
      {/* Top action buttons matching OptivaOne */}
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onHome}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>
      </div>

      {/* Section Header matching OptivaOne */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.22em] text-purple-400 mb-3 font-semibold">
            03 · COMPETITOR INTELLIGENCE
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Compare competitors side by side.
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Add brands, select platforms, and compare key metrics in one view.
          </p>
        </div>
      </div>
    </div>
  );
};
