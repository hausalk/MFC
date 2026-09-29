import React from 'react';
import { ArrowRight, Sliders, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { HyperparameterConfig, ModelMetrics } from '../types/mfc';

interface Step4HyperparameterTuningProps {
  config: HyperparameterConfig;
  onChangeConfig: (newConfig: HyperparameterConfig) => void;
  onApplyAndTrain: () => void;
  onProceed: () => void;
  models: {
    linear: ModelMetrics;
    randomForest: ModelMetrics;
    gradientBoosting: ModelMetrics;
  };
  isTraining: boolean;
}

export const Step4HyperparameterTuning: React.FC<Step4HyperparameterTuningProps> = ({
  config,
  onChangeConfig,
  onApplyAndTrain,
  onProceed,
  models,
  isTraining,
}) => {
  const rf = models.randomForest;
  const gb = models.gradientBoosting;

  // Overfitting gap assessment (Train R2 vs CV R2)
  const rfGap = Math.max(0, rf.r2_train - rf.cv_r2_mean);
  const isOverfitting = rfGap > 0.18;

  const handleResetDefaults = () => {
    onChangeConfig({
      rf_n_estimators: 100,
      rf_max_depth: 4,
      rf_min_samples_split: 3,
      gb_n_estimators: 80,
      gb_learning_rate: 0.08,
      gb_max_depth: 3,
      cv_folds: 5,
      use_loocv: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-700 uppercase">
              <span>Step 04</span>
              <span>·</span>
              <span>Hyperparameter Optimization & Cross-Validation Strategy</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Preventing Small-Sample Overfitting in Literature Meta-Analyses
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              When training on 30–80 literature studies, unconstrained tree depth causes rapid memorization of specific lab protocols. Tuning hyperparameters enforces conservative regularization and generalizable bioelectrochemical laws.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Recommendations</span>
            </button>
            <button
              onClick={onProceed}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Proceed to Step 5: Feature Importance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Generalization Health & Overfitting Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-600">Cross-Validation Mode</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900">
              {config.use_loocv ? 'Leave-One-Out (LOOCV)' : `${config.cv_folds}-Fold Stratified CV`}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {config.use_loocv
              ? 'Every single study tested independently against N-1 train folds.'
              : 'Standard 80/20 train-test splits rotated 5 times.'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-600">Generalization Gap (RF)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {(rfGap * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-600">Train R² - CV R²</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {isOverfitting ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> High gap: reduce max_depth
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Well-regularized generalization
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-600">Optimized Performance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-blue-700 tabular-nums">
              {rf.cv_r2_mean.toFixed(3)}
            </span>
            <span className="text-xs text-slate-600">CV R² (RMSE: {rf.rmse_test} mW/m²)</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Ready to quote in review paper Section 6!
          </p>
        </div>
      </div>

      {/* Interactive Hyperparameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Random Forest Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Random Forest Regressor Hyperparameters</h2>
              <p className="text-xs text-slate-600">Bagging ensemble parameter space</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              CV R²: {rf.cv_r2_mean.toFixed(3)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">
                  Number of Estimators (`n_estimators`): {config.rf_n_estimators}
                </label>
                <span className="text-slate-600 font-mono">50 - 200 trees</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="10"
                value={config.rf_n_estimators}
                onChange={(e) =>
                  onChangeConfig({ ...config, rf_n_estimators: parseInt(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-600 mt-1">
                More trees stabilize variance without increasing risk of overfitting.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">
                  Maximum Tree Depth (`max_depth`): {config.rf_max_depth}
                </label>
                <span className="text-slate-600 font-mono">Recommended: 3–5</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={config.rf_max_depth}
                onChange={(e) =>
                  onChangeConfig({ ...config, rf_max_depth: parseInt(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Shallow trees (3-5) enforce broad biophysical principles instead of noise memorization.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">
                  Min Samples Split (`min_samples_split`): {config.rf_min_samples_split}
                </label>
                <span className="text-slate-600 font-mono">2 - 8 samples</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={config.rf_min_samples_split}
                onChange={(e) =>
                  onChangeConfig({ ...config, rf_min_samples_split: parseInt(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Requires at least {config.rf_min_samples_split} literature studies to justify creating an internal branch split.
              </p>
            </div>
          </div>
        </div>

        {/* Gradient Boosting & CV Strategy */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Gradient Boosting & Validation Folds</h2>
              <p className="text-xs text-slate-600">Boosting shrinkage and cross-validation partition</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              CV R²: {gb.cv_r2_mean.toFixed(3)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">
                  Learning Rate (`learning_rate` / shrinkage): {config.gb_learning_rate}
                </label>
                <span className="text-slate-600 font-mono">0.02 - 0.20</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.20"
                step="0.01"
                value={config.gb_learning_rate}
                onChange={(e) =>
                  onChangeConfig({ ...config, gb_learning_rate: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Smaller learning rate (0.05-0.08) scales step size along gradient, preventing overshoot.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">
                  Cross-Validation Folds (K): {config.cv_folds}-Fold
                </label>
                <span className="text-slate-600 font-mono">3 - 10 folds</span>
              </div>
              <div className="flex items-center gap-3">
                {[3, 5, 10].map((k) => (
                  <button
                    key={k}
                    onClick={() => onChangeConfig({ ...config, cv_folds: k, use_loocv: false })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      config.cv_folds === k && !config.use_loocv
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {k}-Fold
                  </button>
                ))}
                <button
                  onClick={() => onChangeConfig({ ...config, use_loocv: true })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    config.use_loocv
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  LOOCV
                </button>
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5">
                5-Fold is standard for journal publication; LOOCV maximizes training data per fold when N &lt; 50.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onApplyAndTrain}
                disabled={isTraining}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                {isTraining ? 'Re-evaluating Folds...' : 'Apply Hyperparameters & Re-evaluate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
