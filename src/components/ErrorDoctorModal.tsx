import React, { useState } from 'react';
import { AlertCircle, Check, Copy, Sparkles, HelpCircle, Code, ArrowRight } from 'lucide-react';
import { diagnoseColabError, ErrorDiagnosis, COMMON_COLAB_ERRORS } from '../utils/errorDiagnoser';

interface ErrorDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ErrorDoctorModal: React.FC<ErrorDoctorModalProps> = ({ isOpen, onClose }) => {
  const [errorInput, setErrorInput] = useState('');
  const [diagnosis, setDiagnosis] = useState<ErrorDiagnosis | null>(COMMON_COLAB_ERRORS.nan_values);
  const [loading, setLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const handleDiagnose = async () => {
    if (!errorInput.trim()) return;
    setLoading(true);
    try {
      const result = await diagnoseColabError(errorInput);
      setDiagnosis(result);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (key: keyof typeof COMMON_COLAB_ERRORS) => {
    const preset = COMMON_COLAB_ERRORS[key];
    setDiagnosis(preset);
    setErrorInput(preset.errorType);
  };

  const handleCopySnippet = () => {
    if (!diagnosis) return;
    navigator.clipboard.writeText(diagnosis.correctedCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Python / Colab Error Doctor & Diagnoser</h2>
              <p className="text-xs text-slate-500">
                Instantly diagnose scikit-learn tracebacks, NaN exceptions, and dimension mismatches.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-mono uppercase font-semibold text-slate-500 block mb-1.5">
              Common Bioelectrochemical Colab Errors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSelectPreset('nan_values')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
              >
                NaN / Missing Values
              </button>
              <button
                onClick={() => handleSelectPreset('classifier_instead_of_regressor')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
              >
                Continuous Label on Classifier
              </button>
              <button
                onClick={() => handleSelectPreset('inconsistent_samples')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
              >
                Inconsistent Sample Count [X, y]
              </button>
              <button
                onClick={() => handleSelectPreset('key_error')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
              >
                KeyError on Target
              </button>
              <button
                onClick={() => handleSelectPreset('overfitting_cv')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
              >
                Overfitting / Negative R²
              </button>
            </div>
          </div>

          {/* Traceback Input */}
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Paste Any Error Traceback from Your Google Colab Cell:
            </label>
            <div className="flex gap-2">
              <textarea
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                placeholder="ValueError: Input contains NaN, infinity or a value too large for dtype('float64')..."
                rows={3}
                className="flex-1 p-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
              <button
                onClick={handleDiagnose}
                disabled={loading || !errorInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center justify-center transition-colors shadow-xs"
              >
                {loading ? 'Analyzing...' : 'Diagnose'}
              </button>
            </div>
          </div>

          {/* Diagnostic Result */}
          {diagnosis && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold">
                    Identified Issue
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {diagnosis.errorType}
                  </h3>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider mb-1">
                  Root Cause:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {diagnosis.cause}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider mb-1">
                  Recommended Solution:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {diagnosis.solution}
                </p>
              </div>

              {/* Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-blue-600" />
                    <span>Corrected Python Code:</span>
                  </h4>
                  <button
                    onClick={handleCopySnippet}
                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  {diagnosis.correctedCodeSnippet}
                </pre>
              </div>

              {/* Electrochemical Context */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-950">
                <span className="font-bold flex items-center gap-1 text-amber-900 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Bioelectrochemical Context:
                </span>
                <p className="text-amber-900 leading-relaxed text-[11px]">
                  {diagnosis.bioelectrochemicalContext}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
