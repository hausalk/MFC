import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, TrendingUp, Sliders, ShieldCheck, HelpCircle } from 'lucide-react';
import { MFCDataRow } from '../types/mfc';
import { computeSummaryStats, computeCorrelationMatrix } from '../utils/mfcDataset';

interface Step2DataCleaningProps {
  dataset: MFCDataRow[];
  onImputeMissing: (strategy: 'median' | 'mean') => void;
  onFilterOutliers: () => void;
  onProceed: () => void;
}

export const Step2DataCleaning: React.FC<Step2DataCleaningProps> = ({
  dataset,
  onImputeMissing,
  onFilterOutliers,
  onProceed,
}) => {
  const [selectedFeatureCorr, setSelectedFeatureCorr] = useState<string>('internal_resistance_ohm');
  const [imputationMethod, setImputationMethod] = useState<'median' | 'mean'>('median');

  const stats = computeSummaryStats(dataset);
  const corrData = computeCorrelationMatrix(dataset);

  const totalMissing = stats.reduce((acc, s) => acc + s.missingCount, 0);
  const totalOutliers = stats.reduce((acc, s) => acc + s.outlierCount, 0);

  // Target correlations sorted
  const targetIdx = corrData.features.indexOf('power_density_mWm2');
  const targetCorrelations = corrData.features
    .map((f, idx) => ({
      feature: f,
      name: corrData.labels[idx],
      r: targetIdx !== -1 ? corrData.matrix[targetIdx][idx] : 0,
    }))
    .filter((c) => c.feature !== 'power_density_mWm2')
    .sort((a, b) => Math.abs(b.r) - Math.abs(a.r));

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-700 uppercase">
              <span>Step 02</span>
              <span>·</span>
              <span>Data Cleaning & Exploratory Data Analysis (EDA)</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Data Validation, Outlier Auditing & Electrochemical Correlation
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Standardizing small literature datasets requires systematic missing value handling and verification that extreme operational parameters adhere to bioelectrochemical constraints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onImputeMissing(imputationMethod)}
              disabled={totalMissing === 0}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 transition-colors shadow-2xs"
            >
              Impute Missing ({imputationMethod})
            </button>
            <button
              onClick={onProceed}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Proceed to Step 3: Train Models</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quality Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${totalMissing > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {totalMissing > 0 ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-600">Missing Values</span>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
              {totalMissing} <span className="text-xs font-normal text-slate-600">cells</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {totalMissing > 0
                ? 'Impute with column medians before feeding to Scikit-Learn regressors.'
                : 'Zero missing values detected across all 12 columns.'}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-600">IQR Outliers Detected</span>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
              {totalOutliers} <span className="text-xs font-normal text-slate-600">points (1.5× IQR)</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              MFC literature naturally includes benchmark high-power studies (e.g. Pt cathode, brush anodes).
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-600">Feature Scaling Plan</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              StandardScaler (Z-Score)
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Required for Ridge regression; trees (Random Forest/GB) are inherently scale-invariant.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Statistics Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Parametric Summary Statistics & Quartile Distribution
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Calculated across all {dataset.length} experimental samples. Outliers flagged via Tukey's fences ($Q_1 - 1.5 \\times IQR$ to $Q_3 + 1.5 \\times IQR$).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Mean ± Std</th>
                <th className="py-2.5 px-3">Min</th>
                <th className="py-2.5 px-3">25% (Q1)</th>
                <th className="py-2.5 px-3">Median</th>
                <th className="py-2.5 px-3">75% (Q3)</th>
                <th className="py-2.5 px-3">Max</th>
                <th className="py-2.5 px-3">IQR</th>
                <th className="py-2.5 px-3">Outliers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
              {stats.map((row) => (
                <tr key={row.key} className={row.key === 'power_density_mWm2' ? 'bg-blue-50/50 font-semibold' : 'hover:bg-slate-50/60'}>
                  <td className="py-2.5 px-3 font-sans text-slate-900">
                    {row.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{row.unit}</td>
                  <td className="py-2.5 px-3 text-slate-900">
                    {row.mean} ± {row.std}
                  </td>
                  <td className="py-2.5 px-3">{row.min}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.q25}</td>
                  <td className="py-2.5 px-3 text-blue-700 font-semibold">{row.median}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.q75}</td>
                  <td className="py-2.5 px-3">{row.max}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.iqr}</td>
                  <td className="py-2.5 px-3">
                    {row.outlierCount > 0 ? (
                      <span className="text-amber-700 font-semibold">{row.outlierCount}</span>
                    ) : (
                      <span className="text-slate-600">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correlation Matrix & Biophysical Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Matrix Display */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Pearson Correlation Matrix</h2>
              <p className="text-xs text-slate-600">
                Pairwise linear relationships between operational parameters and power density.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-rose-600 rounded-xs inline-block"></span> -1.0 (Inverse)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-slate-100 rounded-xs inline-block border border-slate-300"></span> 0.0
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-600 rounded-xs inline-block"></span> +1.0 (Positive)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-[10px] font-mono border-collapse">
              <thead>
                <tr>
                  <th className="p-1 text-left text-slate-600 font-sans">Feature</th>
                  {corrData.features.map((f, i) => (
                    <th key={f} className="p-1 font-semibold text-slate-600 truncate max-w-[50px]" title={corrData.labels[i]}>
                      {f.slice(0, 4)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {corrData.matrix.map((row, i) => {
                  const featName = corrData.features[i];
                  const isTarget = featName === 'power_density_mWm2';
                  return (
                    <tr key={featName}>
                      <td className={`p-1.5 text-left text-xs font-sans truncate max-w-[120px] ${isTarget ? 'font-bold text-blue-900' : 'text-slate-700'}`}>
                        {corrData.labels[i]}
                      </td>
                      {row.map((val, j) => {
                        let bgColor = 'bg-slate-50 text-slate-700';
                        if (val > 0.6) bgColor = 'bg-blue-600 text-white font-bold';
                        else if (val > 0.3) bgColor = 'bg-blue-200 text-blue-950 font-semibold';
                        else if (val > 0.1) bgColor = 'bg-blue-50 text-blue-900';
                        else if (val < -0.6) bgColor = 'bg-rose-600 text-white font-bold';
                        else if (val < -0.3) bgColor = 'bg-rose-200 text-rose-950 font-semibold';
                        else if (val < -0.1) bgColor = 'bg-rose-50 text-rose-900';

                        return (
                          <td
                            key={j}
                            className={`p-1 border border-white text-center tabular-nums cursor-pointer transition-transform hover:scale-110 ${bgColor}`}
                            title={`${corrData.labels[i]} vs ${corrData.labels[j]}: r = ${val}`}
                            onClick={() => setSelectedFeatureCorr(corrData.features[j])}
                          >
                            {val.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Target Correlation Ranking & Biophysical Insights */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Correlations with Power Density
            </h2>
            <p className="text-xs text-slate-600">
              Ranked by absolute Pearson coefficient ($r$) against $power\_density\_mWm2$.
            </p>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {targetCorrelations.map((item) => {
              const absVal = Math.abs(item.r);
              const isPositive = item.r >= 0;
              return (
                <div key={item.feature} className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 truncate max-w-[170px]" title={item.name}>
                      {item.name}
                    </span>
                    <span className={`font-mono font-bold tabular-nums ${isPositive ? 'text-blue-700' : 'text-rose-700'}`}>
                      {isPositive ? `+${item.r.toFixed(3)}` : item.r.toFixed(3)}
                    </span>
                  </div>

                  {/* Progress bar representing correlation magnitude */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPositive ? 'bg-blue-600' : 'bg-rose-600'}`}
                      style={{ width: `${Math.round(absVal * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
              Bioelectrochemical Insight:
            </span>
            <p className="text-[11px] leading-relaxed text-blue-800">
              Internal resistance (R_int) exhibits the strongest negative correlation (r ≈ -0.78), verifying that ohmic overpotentials dominate power losses. COD exhibits positive correlation (r ≈ +0.48) in accordance with Monod substrate kinetics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
