import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Info } from 'lucide-react';
import { MFCDataRow, MFC_COLUMNS_METADATA } from '../types/mfc';
import { parseCSV, exportToCSV, BENCHMARK_LITERATURE_MFC_DATA } from '../utils/mfcDataset';

interface Step1DataIngestionProps {
  dataset: MFCDataRow[];
  onUpdateDataset: (newData: MFCDataRow[], sourceName: string) => void;
  onProceed: () => void;
  dataSourceName: string;
}

export const Step1DataIngestion: React.FC<Step1DataIngestionProps> = ({
  dataset,
  onUpdateDataset,
  onProceed,
  dataSourceName,
}) => {
  const [pasteText, setPasteText] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Check columns present in current dataset
  const currentKeys = dataset.length > 0 ? Object.keys(dataset[0]) : [];
  const expectedColumns = MFC_COLUMNS_METADATA.map((c) => c.key);
  const missingCols = expectedColumns.filter((col) => !currentKeys.includes(col));
  const hasTarget = currentKeys.includes('power_density_mWm2');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = parseCSV(text);
        if (result.rows.length > 0) {
          onUpdateDataset(result.rows, file.name);
          setParseError(null);
        } else {
          setParseError(result.errors.join('; ') || 'Failed to parse CSV');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPastedCSV = () => {
    if (!pasteText.trim()) return;
    const result = parseCSV(pasteText);
    if (result.rows.length > 0) {
      onUpdateDataset(result.rows, 'Pasted Clipboard Data');
      setShowPasteModal(false);
      setPasteText('');
      setParseError(null);
    } else {
      setParseError(result.errors.join('; ') || 'Could not parse pasted data.');
    }
  };

  const handleLoadBenchmark = () => {
    onUpdateDataset(BENCHMARK_LITERATURE_MFC_DATA, 'Curated Benchmark Literature Dataset (55 Peer-Reviewed MFC Studies)');
    setParseError(null);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = exportToCSV(dataset.length > 0 ? dataset : BENCHMARK_LITERATURE_MFC_DATA);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mfc_dataset_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Instructions Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl p-6 text-white shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-300 mb-2">
            <span>BIOELECTROCHEMICAL REGRESSION PIPELINE</span>
            <span>·</span>
            <span>PROOF-OF-CONCEPT</span>
            <span>·</span>
            <span>REVIEW PAPER SECTION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 text-balance">
            Predicting MFC Power Density from Experimental & Architectural Parameters
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Welcome to your research workbench. To begin step 1 of your 3-day proof-of-concept, please upload or paste your literature-extracted dataset (typically 30–80 rows), or load our benchmark dataset curated from foundational bioelectrochemistry papers (Logan, Cheng, Rabaey, Wang & Ren).
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs">
              <Upload className="w-4 h-4" />
              <span>Upload Your CSV File</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={() => setShowPasteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Paste Raw CSV Text</span>
            </button>

            <button
              onClick={handleLoadBenchmark}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Load Literature Benchmark (55 Rows)</span>
            </button>
          </div>
        </div>
      </div>

      {parseError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Dataset Parsing Warning:</span> {parseError}
          </div>
        </div>
      )}

      {/* Dataset Metadata & Validation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-500">Active Source</span>
          <p className="text-sm font-semibold text-slate-900 mt-1 truncate" title={dataSourceName}>
            {dataSourceName}
          </p>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Ready for training</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-500">Sample Size (N)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {dataset.length}
            </span>
            <span className="text-xs text-slate-500">literature studies</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Target review range: 30–80 rows
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-500">Target Variable</span>
          <p className="text-sm font-semibold text-blue-700 mt-1">
            power_density_mWm2
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Continuous regression target (mW/m²)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-500">Predictor Features</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">11</span>
            <span className="text-xs text-slate-500">operational & design inputs</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Materials (4) + Oper. (5) + Electrochem (2)
          </p>
        </div>
      </div>

      {/* Schema Verification Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              01. Feature Schema & Column Encoding Verification
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Validates that your literature dataset satisfies all 12 input/target requirements for scikit-learn regression models.
            </p>
          </div>
          <button
            onClick={handleDownloadSampleCSV}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Download CSV Template
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-mono">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Units / Encoding Details</th>
                <th className="py-2.5 px-3">Bioelectrochemical Relevance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
              {MFC_COLUMNS_METADATA.map((col) => {
                const isPresent = currentKeys.includes(col.key);
                return (
                  <tr key={col.key} className={isPresent ? 'hover:bg-slate-50/50' : 'bg-rose-50/40'}>
                    <td className="py-2.5 px-3 font-medium">
                      {isPresent ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-mono text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Matched
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1 font-mono text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {col.key}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-600 font-medium">{col.category}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {col.encodedValues ? (
                        <span title={Object.entries(col.encodedValues).map(([k, v]) => `${k}=${v}`).join(', ')}>
                          Categorical encoded (1-5): {Object.values(col.encodedValues).slice(0, 2).join(', ')}...
                        </span>
                      ) : (
                        <span>{col.unit}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={col.description}>
                      {col.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Data Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Dataset Inspection Table (First 10 Studies)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified {dataset.length} samples with 11 features ready for baseline model training.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600">
            Showing 10 of {dataset.length} rows
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
              <tr>
                <th className="py-2 px-2.5">#</th>
                <th className="py-2 px-2.5">Reference / Anode</th>
                <th className="py-2 px-2.5">Cathode</th>
                <th className="py-2 px-2.5">Membrane</th>
                <th className="py-2 px-2.5">Substrate</th>
                <th className="py-2 px-2.5">COD (mg/L)</th>
                <th className="py-2 px-2.5">pH</th>
                <th className="py-2 px-2.5">T (°C)</th>
                <th className="py-2 px-2.5">Area (cm²)</th>
                <th className="py-2 px-2.5">Vol (mL)</th>
                <th className="py-2 px-2.5">CE (%)</th>
                <th className="py-2 px-2.5">R_int (Ω)</th>
                <th className="py-2 px-2.5 bg-blue-50/70 text-blue-900 font-bold">Power (mW/m²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
              {dataset.slice(0, 10).map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-slate-50">
                  <td className="py-2 px-2.5 text-slate-600">{idx + 1}</td>
                  <td className="py-2 px-2.5 font-sans font-medium text-slate-900 truncate max-w-[140px]" title={row.reference || `Anode #${row.anode_material}`}>
                    {row.reference ? row.reference.split(' ')[0] + ' et al.' : `Anode: ${row.anode_material}`}
                  </td>
                  <td className="py-2 px-2.5">{row.cathode_material}</td>
                  <td className="py-2 px-2.5">{row.membrane}</td>
                  <td className="py-2 px-2.5">{row.substrate}</td>
                  <td className="py-2 px-2.5">{row.COD_mgL}</td>
                  <td className="py-2 px-2.5">{row.pH}</td>
                  <td className="py-2 px-2.5">{row.temperature_C}</td>
                  <td className="py-2 px-2.5">{row.electrode_area_cm2}</td>
                  <td className="py-2 px-2.5">{row.reactor_volume_mL}</td>
                  <td className="py-2 px-2.5">{row.coulombic_efficiency_pct}%</td>
                  <td className="py-2 px-2.5 text-amber-700 font-semibold">{row.internal_resistance_ohm}</td>
                  <td className="py-2 px-2.5 bg-blue-50/70 text-blue-900 font-bold">
                    {row.power_density_mWm2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Categorical encoding: 1=Highest standard (e.g. Carbon cloth, Pt/C cathode, Nafion, Acetate)</span>
          </div>

          <button
            onClick={onProceed}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Proceed to Step 2: Data Cleaning & EDA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Paste CSV Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Paste Literature CSV Data</h3>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-mono"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Paste comma, semicolon, or tab-delimited text containing the 11 features and power_density_mWm2.
            </p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`anode_material,cathode_material,membrane,substrate,COD_mgL,pH,temperature_C,electrode_area_cm2,reactor_volume_mL,coulombic_efficiency_pct,internal_resistance_ohm,power_density_mWm2
1,1,1,1,800,7.0,30,7.0,28,55.4,85,1250
1,2,1,1,800,7.0,30,7.0,28,42.1,120,1010`}
              rows={8}
              className="w-full font-mono text-xs p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPastedCSV}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Apply & Parse CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
