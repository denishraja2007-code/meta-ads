import React from 'react';
import { Home, Users, LayoutDashboard, FileBarChart, Sparkles, Bot, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'competitors', label: 'Competitor Profile', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report', icon: FileBarChart },
    { id: 'recommendations', label: 'Recommendation', icon: Sparkles },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
  ];

  const sidebarContent = (
    <div className="w-64 shrink-0 flex flex-col border-r border-white/10 bg-[#0d0e20]/95 backdrop-blur-xl h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="OptivaOne logo"
            className="h-11 w-11 rounded-xl object-cover shadow-glow border border-purple-500/30 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">
              OptivaOne
            </div>
            <div className="text-sm font-semibold leading-tight text-white group-hover:text-purple-300 transition-colors">
              Competitor Profile
              <br />
              Intelligence Engine
            </div>
          </div>
        </button>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-purple-900/40 ring-1 ring-purple-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-purple-400" />
              )}
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom workspace callout */}
      <div className="p-4 border-t border-white/5">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400 leading-relaxed">
          <div className="text-purple-400 mb-1 flex items-center gap-1.5 font-semibold">
            <span>◆</span>
            <span>Workspace Active</span>
          </div>
          Track strategic signals, creative patterns, and engagement opportunities in one focused workspace.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
