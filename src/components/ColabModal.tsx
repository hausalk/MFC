import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Code2, Play } from 'lucide-react';
import { generateColabPythonScript } from '../utils/colabCodeGenerator';

interface ColabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColabModal: React.FC<ColabModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const scriptContent = generateColabPythonScript();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptContent], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mfc_power_prediction_colab.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-slate-100 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-800">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Google Colab Executable Python Script</h2>
              <p className="text-xs text-slate-400">
                End-to-end pipeline: pandas, scikit-learn, 5-fold CV, GridSearchCV, and publication figures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Script' : 'Copy Script'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quick Instructions Bar */}
        <div className="bg-slate-950 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>How to run in Google Colab:</span>
            <span className="text-slate-400">
              Open <a href="https://colab.research.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">colab.new <ExternalLink className="w-2.5 h-2.5" /></a>, paste into cell, and press Shift+Enter.
            </span>
          </div>
          <span className="font-mono text-emerald-400 text-[11px]">PEP-8 Compliant · Zero Setup</span>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
          <pre className="whitespace-pre-wrap select-all">{scriptContent}</pre>
        </div>
      </div>
    </div>
  );
};
