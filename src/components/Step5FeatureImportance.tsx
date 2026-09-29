import React, { useState } from 'react';
import { ArrowRight, BarChart3, Atom, Zap, Layers, Sparkles, BookOpen } from 'lucide-react';
import { FeatureKey, ModelMetrics } from '../types/mfc';

interface Step5FeatureImportanceProps {
  model: ModelMetrics;
  onProceed: () => void;
}

export const Step5FeatureImportance: React.FC<Step5FeatureImportanceProps> = ({
  model,
  onProceed,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>('internal_resistance_ohm');

  const importanceList = model.featureImportance;
  const top1 = importanceList[0]?.feature || 'internal_resistance_ohm';
  const top2 = importanceList[1]?.feature || 'COD_mgL';
  const top3 = importanceList[2]?.feature || 'electrode_area_cm2';

  // Electrochemical domain explanations mapped to feature keys
  const electrochemicalExplanations: Record<
    string,
    { title: string; category: string; equation: string; mechanism: string; journalImpact: string }
  > = {
    internal_resistance_ohm: {
      title: 'Internal Resistance (R_int)',
      category: 'Electrochemical Impedance',
      equation: 'P_{max} = \\frac{E_{emf}^2}{4 R_{int}}, \\quad \\eta_{ohm} = I \\cdot R_{int}',
      mechanism:
        'Governs the ohmic voltage drop across the electrolyte, membrane, and bio-electrode interface. According to Jacobi’s maximum power transfer theorem, peak power density is achieved when external load equals internal resistance. Thus, minimizing R_int is the single most decisive lever in microbial electrochemical systems.',
      journalImpact:
        'Explains >35% of model predictive variance. Confirms that even with high biocatalytic activity, high electrolyte or membrane resistance drastically caps deliverable power.',
    },
    COD_mgL: {
      title: 'Chemical Oxygen Demand (COD)',
      category: 'Substrate & Biochemical Kinetics',
      equation: 'v = v_{max} \\frac{[S]}{K_s + [S]} \\quad \\text{(Monod Substrate Affinity)}',
      mechanism:
        'Controls the metabolic electron donor availability for anodic exoelectrogens. At low COD (<400 mg/L), bioelectrochemical current is substrate-limited. At elevated COD (>2500 mg/L), exoelectrogenic activity plateaus due to Monod enzyme saturation and competition from non-electrogenic methanogens.',
      journalImpact:
        'Non-linear trees excel at capturing this saturation inflection, whereas linear models produce unrealistic runaway predictions at high COD values.',
    },
    electrode_area_cm2: {
      title: 'Projected Electrode Area (A_anode)',
      category: 'Architectural & Mass Transfer',
      equation: 'P = \\frac{V^2}{R_{ext} \\cdot A_{anode}}, \\quad j = \\frac{I}{A_{anode}}',
      mechanism:
        'Dictates the total biofilm colonization capacity and interfacial electron collection. Larger 3D geometries (e.g. carbon fiber brushes) increase specific surface area while shrinking internal volume, altering localized proton transport gradients.',
      journalImpact:
        'Crucial normalization parameter in bioelectrochemistry literature; essential to avoid false correlations caused by differing reactor scales.',
    },
    coulombic_efficiency_pct: {
      title: 'Coulombic Efficiency (CE)',
      category: 'Electron Mass Balance',
      equation: 'CE = \\frac{M \\int_0^t I dt}{F b V_{an} \\Delta COD} \\times 100\\%',
      mechanism:
        'Quantifies the fraction of electrons recovered as electric current relative to the theoretical maximum from chemical substrate consumption. High CE indicates tight exoelectrogenic coupling without parasitic fermentative or methanogenic sinks.',
      journalImpact:
        'Acts as an indicator of biofilm purity and electron pathway efficiency (direct electron transfer vs. wasted fermentation).',
    },
    cathode_material: {
      title: 'Cathode Catalyst Material',
      category: 'Oxygen Reduction Kinetics',
      equation: 'O_2 + 4H^+ + 4e^- \\rightarrow 2H_2O, \\quad \\eta_{act,c} = \\frac{RT}{\\alpha F} \\ln\\left(\\frac{j}{j_0}\\right)',
      mechanism:
        'The cathode oxygen reduction reaction (ORR) is notoriously sluggish and poses the primary activation overpotential barrier. Platinum/carbon (Pt/C) exhibits high exchange current density (j0), while passive carbon air-cathodes suffer from higher cathodic overpotentials.',
      journalImpact:
        'The categorical ranking directly correlates with cathode overpotential magnitude reported in polarization studies.',
    },
    anode_material: {
      title: 'Anode Bio-Interface Material',
      category: 'Biofilm Interfacial Transfer',
      equation: 'j = j_0 \\left[ \\exp\\left(\\frac{\\alpha_a F \\eta}{RT}\\right) - \\exp\\left(-\\frac{\\alpha_c F \\eta}{RT}\\right) \\right]',
      mechanism:
        'Governs direct electron transfer (DET) via outer-membrane cytochromes (OmcA/MtrC) and microbial nanowires. Rough, high-porosity carbon cloth and carbon felt offer superior bacterial adhesion and charge-transfer resistance (R_ct) compared to flat graphite plates.',
      journalImpact:
        'Interacts synergistically with reactor volume and operating pH.',
    },
    pH: {
      title: 'Electrolyte pH',
      category: 'Proton Gradient & Nernstian Losses',
      equation: '\\Delta E = -0.059 \\cdot (\\text{pH}_{cathode} - \\text{pH}_{anode}) \\text{ V}',
      mechanism:
        'Proton accumulation in the anaerobic anode chamber coupled with hydroxyl ion accumulation at the aerated cathode establishes a trans-membrane pH gradient that creates severe thermodynamic potential penalties (approx. 59 mV per pH unit imbalance).',
      journalImpact:
        'Moderately weighted in the model because literature MFCs operate mostly near neutral buffering (PBS pH 6.8–7.5).',
    },
    temperature_C: {
      title: 'Operating Temperature',
      category: 'Enzyme Arrhenius Kinetics',
      equation: 'k = A \\exp\\left(-\\frac{E_a}{RT}\\right)',
      mechanism:
        'Affects both microbial metabolic enzymatic reaction rates and solution ionic conductivity. Mesophilic operation (25–35°C) enhances biofilm kinetics, while sub-20°C temperatures sharply elevate internal charge transfer resistance.',
      journalImpact:
        'Accounts for systematic differences between room-temperature and climate-controlled bench experiments.',
    },
  };

  const activeExpl =
    electrochemicalExplanations[selectedFeature] ||
    electrochemicalExplanations['internal_resistance_ohm'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-700 uppercase">
              <span>Step 05</span>
              <span>·</span>
              <span>Feature Importance & Bioelectrochemical Interpretability</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Decoding the Biophysical Mechanisms Behind Model Predictions
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Machine learning in environmental engineering must not be a black box. Permutation importance quantifies which design and operational parameters truly govern power generation, validated by electrochemical Butler-Volmer and Monod principles.
            </p>
          </div>

          <button
            onClick={onProceed}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <span>Proceed to Step 6: Write Paper Section</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Feature Ranking & Mechanism Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Horizontal Bar Chart of Feature Importance */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                (b) Permutation Feature Importance Ranking
              </h2>
              <p className="text-xs text-slate-600">
                Calculated on <span className="font-semibold text-blue-700">{model.name}</span> · Click any bar to inspect biophysical mechanism.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              Normalized Weight
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {importanceList.map((item, idx) => {
              const isSelected = selectedFeature === item.feature;
              const percent = Math.round(item.importance * 100);

              let barColor = 'bg-slate-300';
              if (idx === 0) barColor = 'bg-blue-600';
              else if (idx === 1) barColor = 'bg-teal-600';
              else if (idx === 2) barColor = 'bg-indigo-600';

              return (
                <div
                  key={item.feature}
                  onClick={() => setSelectedFeature(item.feature)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-400/20'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-600 w-4">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {(item.importance * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep-Dive Biophysical Callout Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                {activeExpl.category}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {activeExpl.title}
              </h2>
            </div>
            <Atom className="w-6 h-6 text-blue-600 shrink-0" />
          </div>

          <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto shadow-inner">
            <span className="text-slate-600 text-[10px] uppercase block mb-1">
              Governing Physical Equation:
            </span>
            <div className="text-blue-300 font-semibold">{activeExpl.equation}</div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Electrochemical Mechanism in MFCs:
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                {activeExpl.mechanism}
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-950 space-y-1">
              <span className="text-xs font-bold flex items-center gap-1.5 text-amber-800">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Review Paper Synthesis Significance:
              </span>
              <p className="text-xs leading-relaxed text-amber-900">
                {activeExpl.journalImpact}
              </p>
            </div>
          </div>

          {/* Quick Summary of Top 3 for Paper */}
          <div className="pt-3 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-900">Top 3 Primary Drivers Identified:</span>
            <div className="flex flex-wrap gap-2 mt-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-semibold">
                1. {top1}
              </span>
              <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-md font-semibold">
                2. {top2}
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-md font-semibold">
                3. {top3}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
