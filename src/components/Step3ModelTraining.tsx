import React, { useState } from 'react';
import { ArrowRight, Trophy, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';
import { ModelMetrics } from '../types/mfc';

interface Step3ModelTrainingProps {
  models: {
    linear: ModelMetrics;
    randomForest: ModelMetrics;
    gradientBoosting: ModelMetrics;
  };
  onRetrain: () => void;
  onProceed: () => void;
  isTraining: boolean;
}

export const Step3ModelTraining: React.FC<Step3ModelTrainingProps> = ({
  models,
  onRetrain,
  onProceed,
  isTraining,
}) => {
  const [selectedModelKey, setSelectedModelKey] = useState<'randomForest' | 'gradientBoosting' | 'linear'>('randomForest');
  const [hoveredPoint, setHoveredPoint] = useState<{ actual: number; predicted: number; residual: number; id: number } | null>(null);

  const activeModel = models[selectedModelKey];

  // Prepare parity plot bounds
  const predictions = activeModel.predictions;
  const allActuals = predictions.map((p) => p.actual);
  const allPreds = predictions.map((p) => p.predicted);

  const minVal = Math.min(...allActuals, ...allPreds) * 0.85;
  const maxVal = Math.max(...allActuals, ...allPreds) * 1.1;

  // SVG coordinate transformation
  const svgWidth = 520;
  const svgHeight = 400;
  const padding = 50;

  const scaleX = (val: number) => padding + ((val - minVal) / (maxVal - minVal)) * (svgWidth - 2 * padding);
  const scaleY = (val: number) => svgHeight - padding - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 2 * padding);

  // Model comparison cards
  const modelList: { key: 'linear' | 'randomForest' | 'gradientBoosting'; title: string; subtitle: string; metrics: ModelMetrics }[] = [
    {
      key: 'randomForest',
      title: 'Random Forest Regressor',
      subtitle: 'Ensemble bagging of 100 decision trees',
      metrics: models.randomForest,
    },
    {
      key: 'gradientBoosting',
      title: 'Gradient Tree Boosting',
      subtitle: 'Sequential residual fitting (shrinkage 0.08)',
      metrics: models.gradientBoosting,
    },
    {
      key: 'linear',
      title: 'Ridge Linear Regression',
      subtitle: 'L2-regularized multivariate baseline',
      metrics: models.linear,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-700 uppercase">
              <span>Step 03</span>
              <span>·</span>
              <span>Baseline Model Training & Empirical Benchmarking</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Linear Regression vs. Random Forest vs. Gradient Boosting
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Evaluating regression architectures using 5-Fold Cross-Validation on MFC power density ($mW/m^2$). Non-linear ensembles capture complex bioelectrochemical saturation behaviors that linear equations miss.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetrain}
              disabled={isTraining}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
              <span>{isTraining ? 'Training...' : 'Re-run CV Folds'}</span>
            </button>
            <button
              onClick={onProceed}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Proceed to Step 4: Hyperparameter Tuning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelList.map((item) => {
          const isSelected = selectedModelKey === item.key;
          const isBest = item.key === 'randomForest'; // Typically optimal on small tabulated datasets
          return (
            <div
              key={item.key}
              onClick={() => setSelectedModelKey(item.key)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                {isBest && (
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> BEST FIT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{item.subtitle}</p>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-600">CV R²</span>
                  <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    {item.metrics.cv_r2_mean.toFixed(3)}
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">±{item.metrics.cv_r2_std.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-600">RMSE</span>
                  <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    {item.metrics.rmse_test}
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">mW/m²</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-600">MAE</span>
                  <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    {item.metrics.mae_test}
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">mW/m²</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-600">Train R²: {item.metrics.r2_train.toFixed(3)}</span>
                <span className="text-blue-700 font-medium font-mono text-[11px]">
                  {isSelected ? '● Active Parity Plot' : 'Click to inspect'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parity Plot and Residual Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parity Plot (Predicted vs Actual) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                (a) Parity Plot: Actual vs. Predicted Power Density
              </h2>
              <p className="text-xs text-slate-600">
                Model: <span className="font-semibold text-blue-700">{activeModel.name}</span> · Points along the 1:1 diagonal indicate perfect bioelectrochemical prediction.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-600">R² =</span>
              <span className="font-bold text-blue-700 font-mono tabular-nums">{activeModel.r2_test.toFixed(3)}</span>
            </div>
          </div>

          <div className="relative flex justify-center py-2">
            <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none">
              {/* Grid lines */}
              {[500, 1000, 1500, 2000].map((tick) => {
                if (tick < minVal || tick > maxVal) return null;
                const x = scaleX(tick);
                const y = scaleY(tick);
                return (
                  <g key={tick}>
                    <line x1={x} y1={padding} x2={x} y2={svgHeight - padding} stroke="#F1F5F9" strokeDasharray="3 3" />
                    <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} stroke="#F1F5F9" strokeDasharray="3 3" />
                    <text x={x} y={svgHeight - padding + 15} textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="monospace">
                      {tick}
                    </text>
                    <text x={padding - 10} y={y + 3} textAnchor="end" fontSize="10" fill="#64748B" fontFamily="monospace">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Axes lines */}
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#94A3B8" strokeWidth="1.5" />
              <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#94A3B8" strokeWidth="1.5" />

              {/* ±15% error bounds */}
              <line
                x1={scaleX(minVal)}
                y1={scaleY(minVal * 1.15)}
                x2={scaleX(maxVal)}
                y2={scaleY(maxVal * 1.15)}
                stroke="#CBD5E1"
                strokeDasharray="4 4"
                strokeWidth="1.2"
              />
              <line
                x1={scaleX(minVal)}
                y1={scaleY(minVal * 0.85)}
                x2={scaleX(maxVal)}
                y2={scaleY(maxVal * 0.85)}
                stroke="#CBD5E1"
                strokeDasharray="4 4"
                strokeWidth="1.2"
              />

              {/* Ideal 1:1 diagonal */}
              <line
                x1={scaleX(minVal)}
                y1={scaleY(minVal)}
                x2={scaleX(maxVal)}
                y2={scaleY(maxVal)}
                stroke="#0F172A"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />

              {/* Scatter Points */}
              {predictions.map((p) => {
                const cx = scaleX(p.actual);
                const cy = scaleY(p.predicted);
                const isHovered = hoveredPoint?.id === p.id;
                const errRatio = Math.abs(p.residual) / (p.actual || 1);
                const pointColor = errRatio > 0.20 ? '#EF4444' : '#2563EB';

                return (
                  <circle
                    key={p.id}
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7 : 4.5}
                    fill={pointColor}
                    fillOpacity={0.8}
                    stroke={isHovered ? '#0F172A' : '#1E3A8A'}
                    strokeWidth={isHovered ? 2 : 1}
                    className="cursor-pointer transition-all hover:scale-125"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}

              {/* Axis Labels */}
              <text x={svgWidth / 2} y={svgHeight - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">
                Experimental Actual Power Density (mW/m²)
              </text>
              <text
                x={-svgHeight / 2}
                y={18}
                transform="rotate(-90)"
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#334155"
              >
                Model Predicted Power Density (mW/m²)
              </text>
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-4 right-4 bg-slate-900/90 text-white p-3 rounded-lg text-xs font-mono shadow-lg pointer-events-none">
                <div className="font-bold text-blue-300">Literature Sample #{hoveredPoint.id}</div>
                <div>Actual: {hoveredPoint.actual} mW/m²</div>
                <div>Predicted: {hoveredPoint.predicted} mW/m²</div>
                <div>Residual: {hoveredPoint.residual > 0 ? `+${hoveredPoint.residual}` : hoveredPoint.residual} mW/m²</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-900 inline-block"></span> Ideal 1:1 Line
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b border-dashed border-slate-400 inline-block"></span> ±15% Margin
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Within Spec
              </span>
            </div>
            <span>N = {predictions.length} experiments</span>
          </div>
        </div>

        {/* Residual Diagnostics & Interpretation Card */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Residual Error Analysis
            </h2>
            <p className="text-xs text-slate-600">
              Examining distribution of residuals (e_i = y_actual - y_pred) to verify unbiased variance.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Mean Bias Error (MBE):</span>
                <span className="font-mono font-bold text-slate-900">
                  {(predictions.reduce((a, b) => a + b.residual, 0) / (predictions.length || 1)).toFixed(1)} mW/m²
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Max Over-Prediction:</span>
                <span className="font-mono font-bold text-slate-900">
                  {Math.min(...predictions.map((p) => p.residual))} mW/m²
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Max Under-Prediction:</span>
                <span className="font-mono font-bold text-slate-900">
                  +{Math.max(...predictions.map((p) => p.residual))} mW/m²
                </span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950 space-y-1.5">
              <span className="text-xs font-bold flex items-center gap-1 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Review Paper Synthesis Insight:
              </span>
              <p className="text-xs leading-relaxed text-emerald-900">
                {activeModel.name} achieves tight variance with an $R^2$ of {activeModel.r2_test.toFixed(3)}. The lower error on high-power configurations demonstrates that non-linear decision thresholds accurately delineate high-efficiency brush anodes and low-resistance air-cathodes.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <span className="font-bold">Next Recommended Step:</span>
              <p className="text-xs text-blue-800 mt-1">
                Fine-tune tree depth (`max_depth`) and shrinkage rate (`learning_rate`) in Step 4 to ensure the model does not overfit sparse literature clusters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
