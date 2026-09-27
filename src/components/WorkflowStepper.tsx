import React from 'react';
import { MapPin, Building2, GitCompare, BarChart3, Check } from 'lucide-react';

interface WorkflowStepperProps {
  currentStage: number;
  completedStages: number[];
  onStageClick?: (stage: number) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStage,
  completedStages,
  onStageClick,
}) => {
  const stages = [
    { id: 1, label: 'Scope', sublabel: 'Location & Track', icon: MapPin },
    { id: 2, label: 'First Company', sublabel: 'Profile & Period', icon: Building2 },
    { id: 3, label: 'Add or Skip', sublabel: 'Competitor Option', icon: GitCompare },
    { id: 4, label: 'Results', sublabel: 'Live Intelligence', icon: BarChart3 },
  ];

  return (
    <div className="w-full mb-6">
      <nav aria-label="Workflow Stages" className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isCurrent = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id);
          const isClickable = Boolean(onStageClick && (isCompleted || stage.id <= currentStage));

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => isClickable && onStageClick && onStageClick(stage.id)}
              disabled={!isClickable}
              className={`group flex items-center gap-3 p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                isCurrent
                  ? 'bg-gradient-to-r from-[#171a3d] to-[#1e1c45] border-indigo-500/80 shadow-lg shadow-indigo-950/40 text-white'
                  : isCompleted
                  ? 'bg-[#101229]/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer'
                  : 'bg-[#0d0f22]/50 border-slate-800/40 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                    : 'bg-[#151733] text-slate-500'
                }`}
              >
                {isCompleted && !isCurrent ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    0{stage.id}
                  </span>
                  <span className={`text-xs font-semibold truncate ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                    {stage.label}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {stage.sublabel}
                </div>
              </div>

              {isCurrent && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
