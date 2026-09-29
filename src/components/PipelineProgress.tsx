import React from 'react';
import { Database, Sparkles, Cpu, Sliders, BarChart3, FileText, CheckCircle2 } from 'lucide-react';

export type PipelineStepId = 'ingestion' | 'cleaning' | 'training' | 'tuning' | 'importance' | 'manuscript';

interface PipelineProgressProps {
  currentStep: PipelineStepId;
  onSelectStep: (step: PipelineStepId) => void;
  completedSteps: Record<PipelineStepId, boolean>;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
}) => {
  const steps: { id: PipelineStepId; number: string; title: string; subtitle: string; icon: any }[] = [
    {
      id: 'ingestion',
      number: '01',
      title: 'Dataset Ingestion',
      subtitle: 'Upload or Benchmark (N=55)',
      icon: Database,
    },
    {
      id: 'cleaning',
      number: '02',
      title: 'Cleaning & EDA',
      subtitle: 'IQR Outliers & Correlations',
      icon: Sparkles,
    },
    {
      id: 'training',
      number: '03',
      title: 'Model Training',
      subtitle: 'Ridge, RF, Gradient Boost',
      icon: Cpu,
    },
    {
      id: 'tuning',
      number: '04',
      title: 'Tuning & CV',
      subtitle: '5-Fold CV & Overfitting Check',
      icon: Sliders,
    },
    {
      id: 'importance',
      number: '05',
      title: 'Feature Importance',
      subtitle: 'Ohmic & Monod Kinetics',
      icon: BarChart3,
    },
    {
      id: 'manuscript',
      number: '06',
      title: 'Review Paper Drafter',
      subtitle: '500-800 Words & Integration',
      icon: FileText,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps[step.id];

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900 shadow-xs'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100/60'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md mt-0.5 shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-medium text-slate-600">
                      {step.number}
                    </span>
                    <span className="text-xs font-semibold truncate text-slate-800">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5 font-normal">
                    {step.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
