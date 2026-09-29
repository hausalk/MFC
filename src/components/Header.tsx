import React from 'react';
import { Play, FileText, Code2, AlertCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  onRunModels: () => void;
  onOpenColab: () => void;
  onOpenErrorDoctor: () => void;
  onOpenAssistant: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isTraining: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRunModels,
  onOpenColab,
  onOpenErrorDoctor,
  onOpenAssistant,
  activeTab,
  setActiveTab,
  isTraining,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('ingestion')}
          className="text-lg font-bold tracking-tight text-slate-900 text-left hover:text-blue-700 transition-colors"
        >
          MFC Bioelectrochemical ML Studio
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'ingestion' || activeTab === 'cleaning'
                ? 'text-blue-600 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Dataset & Cleaning
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'training' || activeTab === 'tuning'
                ? 'text-blue-600 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Models & CV
          </button>
          <button
            onClick={() => setActiveTab('importance')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'importance'
                ? 'text-blue-600 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Feature Importance
          </button>
          <button
            onClick={() => setActiveTab('manuscript')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'manuscript'
                ? 'text-blue-600 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Review Paper Section
          </button>
          <button
            onClick={onOpenColab}
            className="flex items-center gap-1.5 hover:text-slate-900 text-slate-600"
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>Colab Script</span>
          </button>
          <button
            onClick={onOpenErrorDoctor}
            className="flex items-center gap-1.5 hover:text-slate-900 text-slate-600"
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Error Doctor</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Ask Bioelectrochemical AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Research Advisor</span>
          </button>

          <button
            onClick={onRunModels}
            disabled={isTraining}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Play className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            <span>{isTraining ? 'Running CV...' : 'Run Pipeline'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
