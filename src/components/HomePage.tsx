import React, { useState } from 'react';
import {
  Menu,
  Globe,
  User,
  Radio,
  Brain,
  Sparkles,
  Compass,
  Zap,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Bot,
  LayoutDashboard,
  FileBarChart,
} from 'lucide-react';

interface HomePageProps {
  onNavigateToCompetitors: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToReport?: () => void;
  onNavigateToRecommendations?: () => void;
  onNavigateToCopilot?: () => void;
  onToggleSidebar?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCompetitors,
  onNavigateToDashboard,
  onNavigateToReport,
  onNavigateToRecommendations,
  onNavigateToCopilot,
  onToggleSidebar,
}) => {
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);

  const methodSteps = [
    {
      num: '01',
      icon: Radio,
      title: 'Collect',
      description: 'Sync competitor profiles, posts, and engagement from Meta.',
    },
    {
      num: '02',
      icon: Brain,
      title: 'Analyze',
      description: 'Uncover creative patterns, cadence, and audience signals.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'Predict',
      description: 'Forecast next campaigns, posting times, and viral windows.',
    },
    {
      num: '04',
      icon: Compass,
      title: 'Recommend',
      description: 'Prioritized moves with a Marketing DNA score and confidence.',
    },
    {
      num: '05',
      icon: Zap,
      title: 'Act',
      description: 'Ship a sharper next content cycle, backed by real signals.',
    },
  ];

  const featureCards = [
    {
      title: 'Real-time signals',
      description: 'Continuous monitoring of competitor social activity and creative output.',
    },
    {
      title: 'Predictive AI',
      description: 'Forecast next campaigns, posting times, and viral opportunities.',
    },
    {
      title: 'Actionable moves',
      description: 'Prioritized recommendations with confidence scores and rationale.',
    },
    {
      title: 'Built for teams',
      description: 'One focused workspace to align strategy, content, and execution.',
    },
  ];

  return (
    <div className="w-full text-slate-200">
      {/* Top Navigation Bar matching Screenshot 1 */}
      <header className="w-full flex items-center justify-between pb-8 pt-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="OptivaOne logo"
              className="h-9 w-9 rounded-xl object-cover shadow-glow border border-purple-500/30"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-base font-semibold tracking-tight text-white">
              OptivaOne
            </span>
          </div>
        </div>

        {/* Right side controls matching Screenshot 1 */}
        <div className="flex items-center gap-3">
          {/* Live Mode Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsLiveMode(!isLiveMode)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                  isLiveMode ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    isLiveMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                Live Mode
              </span>
            </button>
          </div>

          {/* Language selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedLanguage}</span>
              <span className="text-[10px] text-slate-500">▼</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-[#12142d] border border-slate-700 shadow-xl py-1 z-30 text-xs">
                {['English', 'Spanish', 'French', 'German'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-white/10 ${
                      selectedLanguage === lang ? 'text-purple-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div
            title="User: deniish"
            className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.05] flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-400/50 transition cursor-pointer"
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main Home Content */}
      <div className="py-8 space-y-16 max-w-6xl mx-auto">
        {/* SECTION 1: Welcome & Hero Headline (Screenshot 1) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-[0.2em] text-purple-400 uppercase font-semibold">
              WELCOME
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, deniish!
            </h2>
          </div>

          {/* Big Hero Centerpiece */}
          <div className="py-12 sm:py-16 text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              AI Competitor Profile
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Intelligence Engine
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Transform competitor social media data into actionable marketing intelligence with AI.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onNavigateToCompetitors}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-purple-900/40 transition flex items-center gap-2 cursor-pointer group"
              >
                <span>Launch Competitor Profile Workflow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {onNavigateToCopilot && (
                <button
                  type="button"
                  onClick={onNavigateToCopilot}
                  className="px-4 py-2.5 rounded-xl border border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 hover:text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>AI Copilot</span>
                </button>
              )}

              {onNavigateToRecommendations && (
                <button
                  type="button"
                  onClick={onNavigateToRecommendations}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Action Desk</span>
                </button>
              )}

              {onNavigateToDashboard && (
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </button>
              )}

              {onNavigateToReport && (
                <button
                  type="button"
                  onClick={onNavigateToReport}
                  className="px-4 py-2.5 rounded-xl border border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 hover:text-white font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <FileBarChart className="w-4 h-4 text-purple-400" />
                  <span>Report</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: METHOD Section (Screenshot 2) */}
        <section className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono tracking-[0.2em] text-purple-400 uppercase font-semibold">
              METHOD
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Collect → Analyze → Predict → Recommend → Act
            </h2>
          </div>

          {/* 5 Cards Row matching Screenshot 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {methodSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="glass-card rounded-2xl p-5 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group space-y-4 min-h-[190px]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400 font-bold">
                        {step.num}
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: ABOUT OPTIVAONE (Screenshot 3) */}
        <section className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-[0.2em] text-purple-400 uppercase font-semibold">
              ABOUT OPTIVAONE
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Where competitive intelligence
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                meets applied AI.
              </span>
            </h2>
          </div>

          {/* 2-Column Editorial Copy matching Screenshot 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-400 leading-relaxed border-b border-white/10 pb-8">
            <div className="space-y-4">
              <p>
                OptivaOne is a next-generation, AI-powered competitor intelligence platform built for founders, marketers, and strategy teams who need to move faster than the market. We continuously observe your rivals across social channels, capture the signals that actually predict growth, and translate them into moves you can ship today.
              </p>
              <p>
                Behind the interface, a stack of large language models, forecasting engines, and pattern-recognition systems reads posting cadence, creative direction, engagement quality, and audience behavior — surfacing what's working, what's fading, and what your next campaign should look like.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                Instead of dashboards that only describe the past, OptivaOne predicts the next cycle: viral windows, likely campaign themes, best posting times, and the tactical moves most likely to compound. Every recommendation is scored, ranked, and explained — so your team can decide with confidence, not guesswork.
              </p>
              <p>
                From the Marketing DNA Score to the AI Copilot, every module is designed to compress hours of manual competitor research into minutes, giving small teams the strategic edge of a full research desk.
              </p>
            </div>
          </div>

          {/* 4 Feature Cards matching Screenshot 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {featureCards.map((card, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-2"
              >
                <h4 className="text-sm font-bold text-white">{card.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
