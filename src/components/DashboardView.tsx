import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Users,
  FileText,
  Percent,
  Heart,
  MessageSquare,
  Disc,
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  Star,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Megaphone,
  Eye,
  Share2,
  DollarSign,
  Info,
} from 'lucide-react';
import { CompanyDetails } from '../types';

interface DashboardViewProps {
  firstCompany?: CompanyDetails | null;
  secondCompany?: CompanyDetails | null;
  onBack: () => void;
  onHome: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  firstCompany,
  secondCompany,
  onBack,
  onHome,
}) => {
  // Use companies from workflow if available, or OptivaOne vs StrategyPulse AI as shown in screenshots
  const comp1Name = firstCompany?.companyName || 'OptivaOne';
  const comp1Handle = firstCompany ? `@${firstCompany.companyName.toLowerCase().replace(/\s+/g, '')}` : '@optivaone';
  const comp2Name = secondCompany?.companyName || 'StrategyPulse AI';
  const comp2Handle = secondCompany ? `@${secondCompany.companyName.toLowerCase().replace(/\s+/g, '')}` : '@strategypulse';

  const [activeDonutHover, setActiveDonutHover] = useState<string | null>(null);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200 text-slate-200">
      {/* Top action buttons */}
      <div className="flex items-center gap-2">
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

      {/* Header section matching Screenshot 1 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.22em] text-purple-400 font-semibold mb-2">
            AI INTELLIGENCE DASHBOARD
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Competitor{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Analysis Report
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Side-by-side intelligence for <strong className="text-slate-200">{comp1Name}</strong> vs{' '}
            <strong className="text-slate-200">{comp2Name}</strong>
          </p>
        </div>

        {/* Right metadata pill matching Screenshot 1 */}
        <div className="flex items-center rounded-2xl border border-white/10 bg-[#12142d]/80 backdrop-blur-md px-5 py-3 divide-x divide-white/10 self-start lg:self-auto text-xs shadow-lg">
          <div className="pr-4">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              ANALYSIS TIME
            </div>
            <div className="font-semibold text-white mt-0.5">Sep 27, 2026, 12:02 PM</div>
          </div>
          <div className="px-4">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              DATA RANGE
            </div>
            <div className="font-semibold text-white mt-0.5">Last 30 days</div>
          </div>
          <div className="pl-4">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              DURATION
            </div>
            <div className="font-mono font-semibold text-white mt-0.5">1.8 s</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Top 2 Company Metric Cards (Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Card (StrategyPulse AI) */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Disc className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{comp2Name}</span>
                </h3>
                <p className="text-xs text-slate-400">MarTech · Competitive Intelligence</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{comp2Handle}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>FOLLOWERS</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">87.6K</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>POSTS</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">1,248</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                <span>ENGAGEMENT</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">4.8%</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Heart className="w-3.5 h-3.5 text-pink-400" />
                <span>AVG LIKES</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">4.8K</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>AVG COMMENTS</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">312</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Disc className="w-3.5 h-3.5 text-indigo-400" />
                <span>CONSISTENCY</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">87/100</div>
            </div>
          </div>
        </div>

        {/* Your Company Card (OptivaOne) */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{comp1Name}</span>
                </h3>
                <p className="text-xs text-slate-400">Your company baseline</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{comp1Handle}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>FOLLOWERS</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">52.4K</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>POSTS</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">486</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                <span>ENGAGEMENT</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">3.2%</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Heart className="w-3.5 h-3.5 text-pink-400" />
                <span>AVG LIKES</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">1.9K</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>AVG COMMENTS</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">124</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Disc className="w-3.5 h-3.5 text-indigo-400" />
                <span>CONSISTENCY</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">62/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Posting Frequency & Growth Trends (Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posting Frequency Card with Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Posting Frequency</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">2.4/day</span>
          </div>

          {/* Bar Chart */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-white/10 pb-2 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-500 w-full" />
                <div className="border-b border-dashed border-slate-500 w-full" />
                <div className="border-b border-dashed border-slate-500 w-full" />
                <div className="border-b border-dashed border-slate-500 w-full" />
              </div>

              {[
                { day: 'Mon', val: 2.1, height: '60%' },
                { day: 'Tue', val: 3.1, height: '88%' },
                { day: 'Wed', val: 2.0, height: '56%' },
                { day: 'Thu', val: 3.4, height: '98%' },
                { day: 'Fri', val: 2.8, height: '80%' },
                { day: 'Sat', val: 1.8, height: '50%' },
                { day: 'Sun', val: 1.5, height: '42%' },
              ].map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                  <div
                    className="w-full max-w-[42px] bg-purple-500 rounded-t-lg transition-all group-hover:bg-purple-400 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                    style={{ height: item.height }}
                  />
                  <span className="text-[11px] font-mono text-slate-400 mt-2">{item.day}</span>
                </div>
              ))}
            </div>

            {/* Badges below bar chart matching Screenshot 2 */}
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-[10px] font-mono uppercase font-semibold text-purple-300">
                TUESDAY
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-[10px] font-mono uppercase font-semibold text-purple-300">
                THURSDAY
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-[10px] font-mono uppercase font-semibold text-purple-300">
                FRIDAY
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono font-semibold text-emerald-300">
                10:00 AM
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono font-semibold text-emerald-300">
                2:00 PM
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono font-semibold text-emerald-300">
                7:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Growth Trends Card with Line Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Growth Trends</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">5.6% latest</span>
          </div>

          {/* SVG Line Chart matching Screenshot 2 */}
          <div className="pt-2">
            <div className="h-44 relative border-b border-white/10 pb-2">
              {/* Y Axis scale markers */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-500 pointer-events-none">
                <span>60.0K</span>
                <span>45.0K</span>
                <span>30.0K</span>
                <span>15.0K</span>
                <span>0</span>
              </div>

              {/* SVG Curve */}
              <svg className="w-full h-36 pl-10 overflow-visible" viewBox="0 0 500 130">
                {/* Horizontal guide lines */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="32" x2="500" y2="32" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="500" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="97" x2="500" y2="97" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                {/* Trend line */}
                <path
                  d="M 10 90 L 90 84 L 170 76 L 255 68 L 340 59 L 420 50 L 490 40"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2.5"
                />

                {/* Data points */}
                <circle cx="10" cy="90" r="4" fill="#34d399" />
                <circle cx="90" cy="84" r="4" fill="#34d399" />
                <circle cx="170" cy="76" r="4" fill="#34d399" />
                <circle cx="255" cy="68" r="4" fill="#34d399" />
                <circle cx="340" cy="59" r="4" fill="#34d399" />
                <circle cx="420" cy="50" r="4" fill="#34d399" />
                <circle cx="490" cy="40" r="4" fill="#34d399" />
              </svg>

              {/* X Axis Months */}
              <div className="flex justify-between pl-10 text-[11px] font-mono text-slate-400 mt-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>

            {/* Growth percentages below */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-emerald-400 pt-3">
              <span>Jan ↑4.2%</span>
              <span>Feb ↑5%</span>
              <span>Mar ↑6%</span>
              <span>Apr ↑5.4%</span>
              <span>May ↑5.3%</span>
              <span>Jun ↑5.1%</span>
              <span>Jul ↑5.6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Content Strategy, Creative Formats & Content Performance (Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Content Strategy Donut */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            CONTENT STRATEGY
          </div>

          {/* Donut Chart */}
          <div className="relative w-36 h-36 mx-auto my-2">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Educational 35% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#a855f7"
                strokeWidth="16"
                strokeDasharray="79.2 147"
                strokeDashoffset="0"
              />
              {/* Promotional 28% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#6366f1"
                strokeWidth="16"
                strokeDasharray="63.3 163"
                strokeDashoffset="-79.2"
              />
              {/* Entertainment 22% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#34d399"
                strokeWidth="16"
                strokeDasharray="49.7 176"
                strokeDashoffset="-142.5"
              />
              {/* UserGenerated 15% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#fbbf24"
                strokeWidth="16"
                strokeDasharray="33.9 192"
                strokeDashoffset="-192.2"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Educational</span>
              </span>
              <span className="font-mono font-semibold text-white">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Promotional</span>
              </span>
              <span className="font-mono font-semibold text-white">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Entertainment</span>
              </span>
              <span className="font-mono font-semibold text-white">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>UserGenerated</span>
              </span>
              <span className="font-mono font-semibold text-white">15%</span>
            </div>
          </div>
        </div>

        {/* Creative Formats Donut */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            CREATIVE FORMATS
          </div>

          {/* Donut Chart */}
          <div className="relative w-36 h-36 mx-auto my-2">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Reels 34% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#34d399"
                strokeWidth="16"
                strokeDasharray="76.9 149"
                strokeDashoffset="0"
              />
              {/* Images 24% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#fbbf24"
                strokeWidth="16"
                strokeDasharray="54.3 172"
                strokeDashoffset="-76.9"
              />
              {/* Videos 20% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#f87171"
                strokeWidth="16"
                strokeDasharray="45.2 181"
                strokeDashoffset="-131.2"
              />
              {/* Carousels 16% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#60a5fa"
                strokeWidth="16"
                strokeDasharray="36.2 190"
                strokeDashoffset="-176.4"
              />
              {/* Stories 6% */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#f472b6"
                strokeWidth="16"
                strokeDasharray="13.5 212"
                strokeDashoffset="-212.6"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Reels</span>
              </span>
              <span className="font-mono font-semibold text-white">34%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Images</span>
              </span>
              <span className="font-mono font-semibold text-white">24%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Videos</span>
              </span>
              <span className="font-mono font-semibold text-white">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>Carousels</span>
              </span>
              <span className="font-mono font-semibold text-white">16%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                <span>Stories</span>
              </span>
              <span className="font-mono font-semibold text-white">6%</span>
            </div>
          </div>
        </div>

        {/* Content Performance Horizontal Bars */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Content Performance</span>
            </h3>
          </div>

          {/* Horizontal Bar Chart matching Screenshot 2 */}
          <div className="space-y-3 pt-2">
            {[
              { label: 'Reels', score: 7.8, width: '92%' },
              { label: 'Carousels', score: 4.2, width: '56%' },
              { label: 'Videos', score: 3.7, width: '48%' },
              { label: 'Images', score: 2.4, width: '32%' },
              { label: 'Stories', score: 1.8, width: '24%' },
            ].map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{bar.label}</span>
                </div>
                <div className="h-6 w-full bg-white/[0.04] rounded-lg overflow-hidden flex items-center">
                  <div
                    className="h-full bg-indigo-500 rounded-lg transition-all"
                    style={{ width: bar.width }}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/10">
              <span>0</span>
              <span>2</span>
              <span>4</span>
              <span>6</span>
              <span>8</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Engagement Trends, Cadence & Strategy (Screenshot 3 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Engagement Trends & Best-Performing Content */}
        <div className="space-y-6">
          {/* Engagement Trends */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Engagement Trends</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">8-week</span>
            </div>

            <div className="h-44 relative border-b border-white/10 pb-2">
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-500 pointer-events-none">
                <span>6000</span>
                <span>4500</span>
                <span>3000</span>
                <span>1500</span>
                <span>0</span>
              </div>

              <svg className="w-full h-36 pl-10 overflow-visible" viewBox="0 0 500 130">
                <line x1="0" y1="0" x2="500" y2="0" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="32" x2="500" y2="32" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="500" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="97" x2="500" y2="97" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                {/* Likes Line (purple) */}
                <path
                  d="M 10 80 Q 70 70 140 60 T 280 48 T 420 40 L 490 32"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />

                {/* Comments Line (blue) */}
                <path
                  d="M 10 115 L 70 114 L 140 112 L 210 110 L 280 108 L 350 106 L 420 104 L 490 102"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
              </svg>

              <div className="flex justify-between pl-10 text-[11px] font-mono text-slate-400 mt-1">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
                <span>W6</span>
                <span>W7</span>
                <span>W8</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs pt-2">
              <span className="flex items-center gap-1.5 text-purple-400 font-mono">
                <span className="w-2.5 h-0.5 bg-purple-400 inline-block" />
                <span>Likes</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400 font-mono">
                <span className="w-2.5 h-0.5 bg-indigo-400 inline-block" />
                <span>Comments</span>
              </span>
            </div>
          </div>

          {/* Best-Performing Content */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              <span>Best-Performing Content</span>
            </h3>

            <div className="space-y-3">
              {[
                { rank: '#1', title: 'Short-form Reels', rate: '8.4%', width: '85%' },
                { rank: '#2', title: 'Data Carousels', rate: '6.2%', width: '65%' },
                { rank: '#3', title: 'Tutorial Videos', rate: '5.8%', width: '58%' },
                { rank: '#4', title: 'Case Studies', rate: '4.9%', width: '49%' },
                { rank: '#5', title: 'Static Infographics', rate: '3.6%', width: '36%' },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800 flex items-center justify-center text-xs font-mono font-bold text-purple-300">
                      {item.rank}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-40 justify-end">
                    <span className="font-mono text-xs font-bold text-white">{item.rate}</span>
                    <div className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: item.width }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Calendar Insights (Screenshot 4) */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Content Calendar Insights</span>
            </h3>

            <div className="grid grid-cols-3 gap-4 pt-1">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-semibold">
                  OPTIMAL DAYS
                </div>
                <div className="text-sm font-bold text-white">Tuesday</div>
                <div className="text-sm font-bold text-white">Thursday</div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-semibold">
                  BEST TIMES
                </div>
                <div className="text-xs font-mono font-medium text-slate-300">10:00 AM EST</div>
                <div className="text-xs font-mono font-medium text-slate-300">2:00 PM EST</div>
                <div className="text-xs font-mono font-medium text-slate-300">7:00 PM EST</div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-semibold">
                  PEAK WINDOWS
                </div>
                <div className="text-xs font-mono font-medium text-slate-300">Tue 10–11 AM</div>
                <div className="text-xs font-mono font-medium text-slate-300">Thu 2–3 PM</div>
                <div className="text-xs font-mono font-medium text-slate-300">Fri 7–8 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Posting Frequency Cadence, Promotional Strategy & Content Breakdown */}
        <div className="space-y-6">
          {/* Posting Frequency Comparison */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Posting Frequency</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">1.2/day</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Your cadence</span>
                  <span className="font-mono text-white">1.2/day</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-[45%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Competitor cadence</span>
                  <span className="font-mono text-white">2.4/day</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[85%]" />
                </div>
              </div>

              {/* Warning Banner */}
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-center gap-2 mt-3">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Competitor posts <strong>2.0×</strong> more frequently</span>
              </div>
            </div>
          </div>

          {/* Competitor Promotional Strategy (Screenshot 3 & 4) */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-400" />
              <span>Competitor Promotional Strategy</span>
            </h3>

            {/* OFFERS USED */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                OFFERS USED
              </div>
              <div className="flex flex-wrap gap-2">
                {['FREE TRIALS', 'EARLY-BIRD PRICING', 'BUNDLE DISCOUNTS', 'REFERRAL REWARDS'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg border border-teal-500/40 bg-teal-950/40 text-teal-300 text-[10px] font-mono uppercase font-semibold"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* AD TYPES */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                AD TYPES
              </div>
              <div className="flex flex-wrap gap-2">
                {['SPONSORED POSTS', 'STORY ADS', 'REEL PROMOTIONS', 'CAROUSEL ADS'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg border border-purple-500/40 bg-purple-950/40 text-purple-300 text-[10px] font-mono uppercase font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAS USED */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                CTAS USED
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'START FREE TRIAL',
                  'BOOK A DEMO',
                  'LEARN MORE',
                  'GET STARTED',
                  'COMPARE NOW',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-950/40 text-amber-300 text-[10px] font-mono uppercase font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content Breakdown (Screenshot 4) */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Content Breakdown</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">486 total</span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Reels', count: '142 posts', width: '38%' },
                { label: 'Carousels', count: '98 posts', width: '26%' },
                { label: 'Videos', count: '72 posts', width: '20%' },
                { label: 'Images', count: '126 posts', width: '34%' },
                { label: 'Stories', count: '48 posts', width: '14%' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-xs">
                  <span className="w-20 text-slate-400">{item.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: item.width }} />
                  </div>
                  <span className="w-20 text-right font-mono font-medium text-slate-300">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Side-by-Side Comparison Table (Screenshot 5) */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span>Side-by-Side Comparison</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-4 font-medium">Metric</th>
                <th className="py-3 px-4 font-medium">{comp2Name}</th>
                <th className="py-3 px-4 font-medium">{comp1Name}</th>
                <th className="py-3 px-4 font-medium">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {[
                { metric: 'Total Followers', compVal: '87.6K', ourVal: '52.4K', diff: '↘ 67.2%' },
                { metric: 'Total Posts', compVal: '1,248', ourVal: '486', diff: '↘ 156.8%' },
                { metric: 'Engagement Rate', compVal: '4.8%', ourVal: '3.2%', diff: '↘ 50%' },
                { metric: 'Avg Likes / Post', compVal: '4.8K', ourVal: '1.9K', diff: '↘ 160.5%' },
                { metric: 'Avg Comments / Post', compVal: '312', ourVal: '124', diff: '↘ 151.6%' },
                { metric: 'Posting Frequency', compVal: '2.4/day', ourVal: '1.2/day', diff: '↘ 100%' },
                { metric: 'Campaign Consistency', compVal: '87/100', ourVal: '62/100', diff: '↘ 40.3%' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-sans font-semibold text-white">{row.metric}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-bold">{row.compVal}</td>
                  <td className="py-3.5 px-4 text-slate-300">{row.ourVal}</td>
                  <td className="py-3.5 px-4 text-rose-400 font-semibold">{row.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6: Strengths & Where You Lead / Where You Lag (Screenshot 6) */}
      <div className="space-y-6">
        {/* Row 1: Competitor Strengths vs Your Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competitor Strengths */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Competitor Strengths</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {[
                '2× higher posting frequency with consistent daily cadence',
                'Strong educational content mix (35% educational)',
                'Higher engagement rate (4.8% vs 3.2%)',
                'Campaign consistency score of 87/100',
                'Diversified ad strategy across 4 promotion channels',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">↗</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Your Strengths */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Your Strengths</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {[
                'Steady 5%+ monthly follower growth trend',
                'Strong Reel performance (5.8% engagement)',
                'Authentic community engagement with loyal base',
                'Growing brand awareness in niche market',
                'Lower cost-per-engagement due to organic reach',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Where You Lead vs Where You Lag */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Where You Lead */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Where You Lead</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              No metrics where you currently lead. See recommendations below.
            </p>
          </div>

          {/* Where You Lag */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Where You Lag</span>
            </h4>
            <div className="space-y-2">
              {[
                { metric: 'Avg Likes / Post', diff: '160.5% behind' },
                { metric: 'Total Posts', diff: '156.8% behind' },
                { metric: 'Avg Comments / Post', diff: '151.6% behind' },
                { metric: 'Posting Frequency', diff: '100% behind' },
                { metric: 'Total Followers', diff: '67.2% behind' },
                { metric: 'Engagement Rate', diff: '50% behind' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs text-slate-200"
                >
                  <span>{item.metric}</span>
                  <span className="font-mono text-rose-400 font-semibold">↓ {item.diff}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7: Advertisement Insights (Screenshot 7 & 8) */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-purple-400" />
          <span>Advertisement Insights</span>
        </h3>

        {/* 4 Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>EST. REACH</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">2.4M</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>EST. VIEWS</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">1.7M</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <Percent className="w-3.5 h-3.5 text-emerald-400" />
              <span>ENGAGEMENT FROM ADS</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">3.8%</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>EST. AD SPEND</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              $12K – $18K/month
            </div>
          </div>
        </div>

        {/* Promotion Type Breakdown & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 items-center">
          {/* Donut Chart */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              PROMOTION TYPE BREAKDOWN
            </div>
            <div className="relative w-44 h-44 mx-auto my-2">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Brand awareness 35% */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="16"
                  strokeDasharray="79.2 147"
                  strokeDashoffset="0"
                />
                {/* Lead generation 30% */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#6366f1"
                  strokeWidth="16"
                  strokeDasharray="67.8 158"
                  strokeDashoffset="-79.2"
                />
                {/* Product demos 20% */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#34d399"
                  strokeWidth="16"
                  strokeDasharray="45.2 181"
                  strokeDashoffset="-147"
                />
                {/* Retargeting 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#fbbf24"
                  strokeWidth="16"
                  strokeDasharray="33.9 192"
                  strokeDashoffset="-192.2"
                />
              </svg>
            </div>
          </div>

          {/* Breakdown Details */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              BREAKDOWN DETAILS
            </div>

            <div className="space-y-3">
              {[
                { label: 'Brand awareness', pct: '35%', color: 'bg-purple-500', barColor: 'bg-purple-500' },
                { label: 'Lead generation', pct: '30%', color: 'bg-indigo-500', barColor: 'bg-indigo-500' },
                { label: 'Product demos', pct: '20%', color: 'bg-emerald-400', barColor: 'bg-emerald-400' },
                { label: 'Retargeting', pct: '15%', color: 'bg-amber-400', barColor: 'bg-amber-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-slate-300 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-white">{item.pct}</span>
                    <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full ${item.barColor} rounded-full`} style={{ width: item.pct }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
