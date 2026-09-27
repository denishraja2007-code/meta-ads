import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Home,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Calendar,
  Filter,
  Search,
  Plus,
  Download,
  RotateCcw,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Target,
  Layers,
} from 'lucide-react';
import { CompanyDetails } from '../types';

export interface ActionItem {
  id: string;
  title: string;
  category: 'social' | 'pricing' | 'content' | 'sales' | 'retention' | 'paid';
  categoryLabel: string;
  priority: 'high' | 'quick' | 'medium';
  priorityLabel: string;
  impact: string;
  effort: string;
  dueDateTime: string;
  completed: boolean;
  completedAt?: string;
  owner: string;
  summary: string;
  subtasks: { id: string; text: string; done: boolean }[];
  copilotPrompt: string;
}

interface RecommendationsViewProps {
  firstCompany?: CompanyDetails | null;
  secondCompany?: CompanyDetails | null;
  track?: string;
  onBack: () => void;
  onHome: () => void;
  onAskCopilot: (query: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  firstCompany,
  secondCompany,
  track = 'Shoes',
  onBack,
  onHome,
  onAskCopilot,
}) => {
  const c1Name = firstCompany?.companyName || 'OptivaOne';
  const c2Name = secondCompany?.companyName || 'StrategyPulse AI';
  const activeTrack = firstCompany?.track || track || 'Shoes';

  // State management
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'pending' | 'completed' | 'high' | 'quick' | 'social' | 'pricing'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChecklists, setExpandedChecklists] = useState<Record<string, boolean>>({
    'rec-1': true,
    'rec-2': true,
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'social' | 'pricing' | 'content' | 'sales'>('social');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'quick' | 'medium'>('high');
  const [newTaskImpact, setNewTaskImpact] = useState('+15% Brand Recall');
  const [newTaskDue, setNewTaskDue] = useState('Oct 04, 2026 · 5:00 PM');

  // Initial Action Desk Items reflecting realistic competitive intelligence & matching screenshot
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 'rec-1',
      title: `Capitalize on ${c2Name}'s Unresponsive Social Comment Latency`,
      category: 'social',
      categoryLabel: 'Social Intelligence',
      priority: 'high',
      priorityLabel: 'High Impact',
      impact: '+24% Organic Affinity',
      effort: 'Low Effort · 2 Days',
      dueDateTime: 'Sep 25, 2026 · 4:30 PM',
      completed: true,
      completedAt: 'Sep 25, 2026 · 5:12 PM',
      owner: 'Social & Brand Team',
      summary: `Social monitoring detected ${c2Name} takes over 14 hours to respond to public comments. Rapid 15-minute response triage loop intercepts unsatisfied switchers.`,
      subtasks: [
        { id: 'st-1-1', text: 'Deploy automated alerts for Instagram and LinkedIn brand tags', done: true },
        { id: 'st-1-2', text: 'Draft 5 objection-handling templates for customer care reps', done: true },
        { id: 'st-1-3', text: 'Pin high-satisfaction user reviews to official social profile headers', done: true },
      ],
      copilotPrompt: `How should ${c1Name} exploit ${c2Name}'s slow social response time to win dissatisfied customers?`,
    },
    {
      id: 'rec-2',
      title: `Launch Transparent "Compare & Save" Landing Page`,
      category: 'pricing',
      categoryLabel: 'Pricing & Growth',
      priority: 'quick',
      priorityLabel: 'Quick Win',
      impact: '+18% Trial Conversions',
      effort: 'Quick Win · 3 Days',
      dueDateTime: 'Sep 28, 2026 · 2:00 PM',
      completed: false,
      owner: 'Growth Marketing',
      summary: `Prospective buyers regularly search "${c1Name} vs ${c2Name}". A factual, high-clarity comparison matrix intercepts search traffic before bounce.`,
      subtasks: [
        { id: 'st-2-1', text: `Publish objective feature grid highlighting ${c1Name}'s speed and support`, done: false },
        { id: 'st-2-2', text: `Include 3 verified switcher testimonials from former ${c2Name} users`, done: false },
        { id: 'st-2-3', text: 'Add 30-day money-back guarantee with zero cancellation fees', done: false },
      ],
      copilotPrompt: `Draft copy and section layout for a "${c1Name} vs ${c2Name}" transparent comparison landing page.`,
    },
    {
      id: 'rec-3',
      title: `Double Down on Short-Form Video Teardowns in ${activeTrack}`,
      category: 'content',
      categoryLabel: 'Content Distribution',
      priority: 'high',
      priorityLabel: 'High Impact',
      impact: '+35% Audience Reach',
      effort: 'Medium · 1 Week',
      dueDateTime: 'Sep 26, 2026 · 11:15 AM',
      completed: true,
      completedAt: 'Sep 26, 2026 · 11:45 AM',
      owner: 'Content Studio',
      summary: `${c2Name} has zero active short-form video presence on TikTok or Instagram Reels. Owning this vertical channel gives ${c1Name} uncontested algorithmic reach.`,
      subtasks: [
        { id: 'st-3-1', text: `Produce 3 weekly 30-second teardowns addressing core ${activeTrack} pain points`, done: true },
        { id: 'st-3-2', text: `Partner with 5 niche micro-influencers in ${activeTrack} for authentic demos`, done: true },
        { id: 'st-3-3', text: 'Repurpose viral clips into paid Meta and YouTube Shorts retargeting campaigns', done: true },
      ],
      copilotPrompt: `Suggest 5 viral 30-second video concepts for ${c1Name} in the ${activeTrack} industry to outpace ${c2Name}.`,
    },
    {
      id: 'rec-4',
      title: `Implement Migration Buyout Incentive for Active ${c2Name} Contracts`,
      category: 'sales',
      categoryLabel: 'Sales & Revenue',
      priority: 'high',
      priorityLabel: 'High Impact',
      impact: '+12% Enterprise Win Rate',
      effort: 'Quick Win · 1 Day',
      dueDateTime: 'Sep 29, 2026 · 6:00 PM',
      completed: false,
      owner: 'Sales Operations',
      summary: `Mid-market leads cite remaining competitor contract duration as their primary inertia barrier. Offering buyout credits removes contract lock-in friction.`,
      subtasks: [
        { id: 'st-4-1', text: `Authorize sales reps to credit up to 2 months of service for proof of ${c2Name} cancellation`, done: false },
        { id: 'st-4-2', text: 'Provide 1-click automated account data migration assistance', done: false },
        { id: 'st-4-3', text: 'Deploy "Stuck in a Contract?" banner to high-intent comparison visitors', done: false },
      ],
      copilotPrompt: `How should our sales team structure and pitch a contract buyout incentive against ${c2Name}?`,
    },
    {
      id: 'rec-5',
      title: `Deploy Branded Keyword Defense Against Competitor Conquesting`,
      category: 'paid',
      categoryLabel: 'Paid Search (SEM)',
      priority: 'quick',
      priorityLabel: 'Quick Win',
      impact: '+15% Direct Conversions',
      effort: 'Quick Win · 4 Hours',
      dueDateTime: 'Sep 30, 2026 · 10:00 AM',
      completed: false,
      owner: 'Performance Marketing',
      summary: `Paid ad monitoring shows third-party affiliates bidding on ${c1Name} branded keywords. Defensive exact-match campaigns lock down conversion traffic.`,
      subtasks: [
        { id: 'st-5-1', text: `Configure exact-match brand protection campaigns on Google Ads`, done: false },
        { id: 'st-5-2', text: `Add sitelink extensions directly pointing to trial onboarding and feature comparisons`, done: false },
        { id: 'st-5-3', text: 'Monitor daily impression share to maintain >90% absolute top-of-page rank', done: false },
      ],
      copilotPrompt: `What is the optimal Google Ads bidding strategy for ${c1Name} to protect branded keywords against ${c2Name}?`,
    },
    {
      id: 'rec-6',
      title: `Proactive Churn Intervention & Win-Back Telemetry Loop`,
      category: 'retention',
      categoryLabel: 'Retention & Loyalty',
      priority: 'medium',
      priorityLabel: 'Strategic Defense',
      impact: '-19% Account Attrition',
      effort: 'Medium · 4 Days',
      dueDateTime: 'Oct 02, 2026 · 3:00 PM',
      completed: false,
      owner: 'Customer Success',
      summary: `Analyze user engagement dips that historically precede switching to ${c2Name}. Trigger proactive CS check-ins before renewal risk escalates.`,
      subtasks: [
        { id: 'st-6-1', text: 'Set automated alert flags when weekly active session time drops below 30%', done: false },
        { id: 'st-6-2', text: 'Prepare executive sponsor outreach cadence for at-risk enterprise accounts', done: false },
        { id: 'st-6-3', text: 'Offer complimentary optimization audit sessions to re-engage accounts', done: false },
      ],
      copilotPrompt: `Draft a proactive customer retention playbook for ${c1Name} to prevent customer defection to ${c2Name}.`,
    },
  ]);

  // Toggle main task completion
  const handleToggleTask = (taskId: string) => {
    setActionItems((prev) =>
      prev.map((item) => {
        if (item.id === taskId) {
          const newCompleted = !item.completed;
          return {
            ...item,
            completed: newCompleted,
            completedAt: newCompleted
              ? new Date().toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : undefined,
            // When marking complete, mark all subtasks complete as well
            subtasks: item.subtasks.map((st) => ({
              ...st,
              done: newCompleted,
            })),
          };
        }
        return item;
      })
    );
  };

  // Toggle individual subtask
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setActionItems((prev) =>
      prev.map((item) => {
        if (item.id === taskId) {
          const updatedSubtasks = item.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          );
          const allDone = updatedSubtasks.every((st) => st.done);
          return {
            ...item,
            subtasks: updatedSubtasks,
            completed: allDone,
            completedAt: allDone && !item.completed
              ? new Date().toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : item.completedAt,
          };
        }
        return item;
      })
    );
  };

  // Toggle checklist drawer
  const toggleChecklistExpand = (taskId: string) => {
    setExpandedChecklists((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Add custom task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ActionItem = {
      id: `custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      categoryLabel:
        newTaskCategory === 'social'
          ? 'Social Intelligence'
          : newTaskCategory === 'pricing'
          ? 'Pricing & Growth'
          : newTaskCategory === 'content'
          ? 'Content Distribution'
          : 'Sales & Revenue',
      priority: newTaskPriority,
      priorityLabel:
        newTaskPriority === 'high'
          ? 'High Impact'
          : newTaskPriority === 'quick'
          ? 'Quick Win'
          : 'Strategic Defense',
      impact: newTaskImpact || '+12% Performance Lift',
      effort: 'Flexible · Scheduled',
      dueDateTime: newTaskDue || 'Next Sprint',
      completed: false,
      owner: 'Growth Team',
      summary: `Custom strategic move configured by ${c1Name} operations desk.`,
      subtasks: [
        { id: `st-${Date.now()}-1`, text: 'Define execution milestone and assign lead', done: false },
        { id: `st-${Date.now()}-2`, text: 'Validate performance uplift against competitor baseline', done: false },
      ],
      copilotPrompt: `How should ${c1Name} execute this action: "${newTaskTitle.trim()}" against ${c2Name}?`,
    };

    setActionItems((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  // Export Action Plan
  const handleExportPlan = () => {
    const markdownContent = `# OptivaOne AI Recommendation Action Desk
Generated for: ${c1Name} vs ${c2Name}
Industry Vertical: ${activeTrack}
Sprint Period: Current Active Sprint
Analysis Timestamp: ${new Date().toLocaleString()}

## Summary
- Total Actions: ${actionItems.length}
- Completed: ${actionItems.filter((i) => i.completed).length}
- Pending: ${actionItems.filter((i) => !i.completed).length}

---

${actionItems
  .map(
    (item, idx) => `### ${idx + 1}. [${item.completed ? 'X' : ' '}] ${item.title}
- **Status:** ${item.completed ? `COMPLETED (${item.completedAt || 'Verified'})` : 'PENDING'}
- **Priority:** ${item.priorityLabel}
- **Category:** ${item.categoryLabel}
- **Estimated Impact:** ${item.impact}
- **Due Date/Time:** ${item.dueDateTime}
- **Owner:** ${item.owner}
- **Summary:** ${item.summary}
- **Execution Checklist:**
${item.subtasks.map((st) => `  - [${st.done ? 'x' : ' '}] ${st.text}`).join('\n')}
`
  )
  .join('\n\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OptivaOne-Action-Desk-${c1Name}-vs-${c2Name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice('Action Plan exported successfully as Markdown!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Metrics computation
  const totalTasks = actionItems.length;
  const completedCount = actionItems.filter((i) => i.completed).length;
  const pendingCount = totalTasks - completedCount;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const highImpactCount = actionItems.filter((i) => i.priority === 'high').length;

  // Filtered list
  const filteredItems = useMemo(() => {
    return actionItems.filter((item) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesCat = item.categoryLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesCat) return false;
      }

      // Tab filter
      if (activeFilter === 'all') return true;
      if (activeFilter === 'pending') return !item.completed;
      if (activeFilter === 'completed') return item.completed;
      if (activeFilter === 'high') return item.priority === 'high';
      if (activeFilter === 'quick') return item.priority === 'quick';
      if (activeFilter === 'social') return item.category === 'social';
      if (activeFilter === 'pricing') return item.category === 'pricing' || item.category === 'sales';
      return true;
    });
  }, [actionItems, activeFilter, searchQuery]);

  return (
    <div className="w-full space-y-7 animate-in fade-in duration-200 text-slate-200">
      {/* Top action buttons */}
      <div className="flex items-center justify-between gap-4">
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

        {/* Right metadata pill matching Dashboard style */}
        <div className="flex items-center rounded-2xl border border-white/10 bg-[#12142d]/80 backdrop-blur-md px-4 py-2 divide-x divide-white/10 text-xs shadow-lg">
          <div className="pr-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                ACTION DESK
              </div>
              <div className="font-semibold text-white">Live Execution Hub</div>
            </div>
          </div>
          <div className="px-3">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              SPRINT CYCLE
            </div>
            <div className="font-semibold text-white">Week 39 · Q3</div>
          </div>
          <div className="pl-3">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              STATUS
            </div>
            <div className="font-mono font-semibold text-emerald-400">{progressPercent}% Completed</div>
          </div>
        </div>
      </div>

      {/* Header section matching OptivaOne design */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.22em] text-purple-400 font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>05 · AI RECOMMENDATIONS · ACTION DESK</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            AI Recommendation{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Action Desk
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Prioritized strategic execution playbook derived from competitive intelligence between{' '}
            <strong className="text-slate-200">{c1Name}</strong> and{' '}
            <strong className="text-slate-200">{c2Name}</strong> in{' '}
            <span className="text-purple-300 font-medium">{activeTrack}</span>.
          </p>
        </div>

        {/* Global Action Desk controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md shadow-purple-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingTask ? 'Close Form' : 'Add Action Item'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportPlan}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export Plan</span>
          </button>
        </div>
      </div>

      {/* Export notification badge */}
      {exportNotice && (
        <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportNotice(null)}
            className="text-purple-400 hover:text-white text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top 4 KPI Action Desk Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>TOTAL ACTIONS</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalTasks}</div>
          <div className="text-[11px] text-slate-500">Scheduled for execution</div>
        </div>

        {/* Completed Progress */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>COMPLETED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{completedCount}</span>
            <span className="text-xs font-mono text-slate-400">of {totalTasks} ({progressPercent}%)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* High Impact Items */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>HIGH IMPACT</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{highImpactCount}</div>
          <div className="text-[11px] text-slate-500">Critical competitive moats</div>
        </div>

        {/* Projected Lift */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>PROJECTED LIFT</span>
            <Target className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300">+28.4%</div>
          <div className="text-[11px] text-slate-500">Estimated share of voice gain</div>
        </div>
      </div>

      {/* Optional: Add Action Item Drawer/Form */}
      {isAddingTask && (
        <form
          onSubmit={handleCreateTask}
          className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-purple-950/20 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Create New Tactical Action Item</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Sprint Week 39</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-medium text-slate-300">Action Title / Objective</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={`e.g. Conduct weekly pricing scrape of ${c2Name}`}
                required
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300">Priority Level</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#12142d] text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="high">High Impact</option>
                <option value="quick">Quick Win</option>
                <option value="medium">Strategic Defense</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300">Category Domain</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#12142d] text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="social">Social Intelligence</option>
                <option value="pricing">Pricing & Growth</option>
                <option value="content">Content Distribution</option>
                <option value="sales">Sales & Revenue</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300">Expected Impact</label>
              <input
                type="text"
                value={newTaskImpact}
                onChange={(e) => setNewTaskImpact(e.target.value)}
                placeholder="+15% Conversion"
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300">Target Date & Time</label>
              <input
                type="text"
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
                placeholder="Oct 04, 2026 · 5:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md transition cursor-pointer"
            >
              Add to Action Desk
            </button>
          </div>
        </form>
      )}

      {/* MAIN CARD: Weekly Action Plan (Matching User's Reference) */}
      <div className="glass-card rounded-2xl border border-white/10 bg-[#0d0e22]/90 shadow-xl overflow-hidden">
        {/* Card Header matching reference */}
        <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Weekly Action Plan</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold">
                  Sprint Week 39
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target dates, owner assignments, and completion states for active counter-maneuvers.
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search action items..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-44 sm:w-56"
              />
            </div>

            {/* Segmented Filter Control (zero-pill discipline: functional button tabs) */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl shrink-0">
              {[
                { id: 'all', label: `All (${actionItems.length})` },
                { id: 'pending', label: `Pending (${pendingCount})` },
                { id: 'completed', label: `Completed (${completedCount})` },
                { id: 'high', label: 'High Impact' },
                { id: 'quick', label: 'Quick Wins' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List Items (Detailed, with clear distinction between completed and pending) */}
        <div className="divide-y divide-white/5">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-400 mb-3">
                <Filter className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-white">No action items match current filter</p>
              <p className="text-xs text-slate-500">
                Try switching the filter tab or clear your search query to view all sprint tasks.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-purple-300 hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isDone = item.completed;
              const isExpanded = !!expandedChecklists[item.id];
              const completedSubtasks = item.subtasks.filter((s) => s.done).length;

              return (
                <div
                  key={item.id}
                  className={`p-6 transition-all duration-200 ${
                    isDone
                      ? 'bg-[#0a1518]/70 border-l-4 border-l-emerald-500'
                      : 'hover:bg-white/[0.02] border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Checkbox + Title + Metadata */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Interactive completion checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(item.id)}
                        aria-label={isDone ? 'Mark as pending' : 'Mark as completed'}
                        className={`mt-1 rounded-lg p-1 transition cursor-pointer shrink-0 ${
                          isDone
                            ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10'
                            : 'text-slate-500 hover:text-white bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      {/* Content details */}
                      <div className="space-y-2 flex-1">
                        {/* Unboxed Metadata row (zero-pill discipline) */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Priority indicator */}
                          <span
                            className={`font-semibold ${
                              item.priority === 'high'
                                ? 'text-amber-400'
                                : item.priority === 'quick'
                                ? 'text-purple-400'
                                : 'text-indigo-400'
                            }`}
                          >
                            {item.priorityLabel}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">
                            ·
                          </span>
                          <span className="text-slate-400">{item.categoryLabel}</span>
                          <span aria-hidden="true" className="text-slate-600">
                            ·
                          </span>
                          <span className="text-slate-300 font-medium">{item.impact}</span>
                          <span aria-hidden="true" className="text-slate-600">
                            ·
                          </span>
                          <span className="text-slate-400">{item.effort}</span>
                        </div>

                        {/* Task Title */}
                        <div className="flex items-baseline gap-3">
                          <h3
                            className={`text-base font-bold tracking-tight transition-colors ${
                              isDone ? 'line-through text-slate-400' : 'text-white'
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>

                        {/* Task Summary Description */}
                        <p className={`text-xs leading-relaxed max-w-3xl ${isDone ? 'text-slate-500' : 'text-slate-300'}`}>
                          {item.summary}
                        </p>

                        {/* Interactive Execution Checklist Drawer */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => toggleChecklistExpand(item.id)}
                            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                          >
                            <span>
                              Execution Checklist ({completedSubtasks}/{item.subtasks.length} subtasks done)
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-2 animate-in fade-in">
                              {item.subtasks.map((st) => (
                                <label
                                  key={st.id}
                                  className="flex items-start gap-2.5 text-xs cursor-pointer group select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={st.done}
                                    onChange={() => handleToggleSubtask(item.id, st.id)}
                                    className="mt-0.5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-0 cursor-pointer"
                                  />
                                  <span
                                    className={`leading-tight transition-colors ${
                                      st.done
                                        ? 'line-through text-slate-500'
                                        : 'text-slate-300 group-hover:text-white'
                                    }`}
                                  >
                                    {st.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Date, Status Badges & Quick Action Buttons */}
                    <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-3 shrink-0 pt-2 lg:pt-0">
                      {/* Due date & status details */}
                      <div className="text-left lg:text-right space-y-1">
                        <div className="flex items-center lg:justify-end gap-1.5 text-xs text-slate-400 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.dueDateTime}</span>
                        </div>

                        {/* Status visual affordance */}
                        <div>
                          {isDone ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              <span>Pending Action</span>
                            </div>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500">Owner: {item.owner}</div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(item.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                            isDone
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                              : 'border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          {isDone ? 'Mark as Pending' : 'Mark as Done'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onAskCopilot(item.copilotPrompt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md shadow-purple-900/40 transition cursor-pointer"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Ask Copilot</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip of Weekly Action Plan card */}
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>OptivaOne AI monitors competitor moves and updates recommendations every 24h</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActionItems((prev) =>
                  prev.map((i) => ({
                    ...i,
                    completed: true,
                    completedAt: 'Just now',
                    subtasks: i.subtasks.map((st) => ({ ...st, done: true })),
                  }))
                );
              }}
              className="text-slate-400 hover:text-white cursor-pointer text-xs"
            >
              Mark All Completed
            </button>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <button
              type="button"
              onClick={() => {
                setActionItems((prev) =>
                  prev.map((i) => ({
                    ...i,
                    completed: false,
                    completedAt: undefined,
                    subtasks: i.subtasks.map((st) => ({ ...st, done: false })),
                  }))
                );
              }}
              className="text-slate-400 hover:text-white cursor-pointer text-xs"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Playbook Context Banner */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-[#0e1026] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>AI COPILOT STRATEGY INTEGRATION</span>
          </div>
          <h4 className="text-base font-bold text-white">
            Need in-depth copy, email cadences, or tactical teardowns?
          </h4>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Launch the OptivaOne AI Copilot to generate full email sequences, comparison ad copy, or customer objection scripts tailored to{' '}
            <strong className="text-slate-200">{c1Name}</strong> and{' '}
            <strong className="text-slate-200">{c2Name}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onAskCopilot(
              `Provide a detailed execution playbook for the top 3 high-impact recommendations for ${c1Name} vs ${c2Name}.`
            )
          }
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/40 transition cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>Open AI Copilot Playbook</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
