export interface MFCDataRow {
  id: number;
  anode_material: number;
  cathode_material: number;
  membrane: number;
  substrate: number;
  COD_mgL: number;
  pH: number;
  temperature_C: number;
  electrode_area_cm2: number;
  reactor_volume_mL: number;
  coulombic_efficiency_pct: number;
  internal_resistance_ohm: number;
  power_density_mWm2: number;
  reference?: string;
}

export type FeatureKey =
  | 'anode_material'
  | 'cathode_material'
  | 'membrane'
  | 'substrate'
  | 'COD_mgL'
  | 'pH'
  | 'temperature_C'
  | 'electrode_area_cm2'
  | 'reactor_volume_mL'
  | 'coulombic_efficiency_pct'
  | 'internal_resistance_ohm';

export type TargetKey = 'power_density_mWm2';

export interface ColumnMetadata {
  name: string;
  key: keyof MFCDataRow;
  unit: string;
  category: 'Operational' | 'Material/Design' | 'Electrochemical' | 'Target';
  description: string;
  encodedValues?: Record<number, string>;
  minTypical: number;
  maxTypical: number;
}

export const MFC_COLUMNS_METADATA: ColumnMetadata[] = [
  {
    name: 'Anode Material',
    key: 'anode_material',
    unit: 'category (1-5)',
    category: 'Material/Design',
    description: 'Biofilm electron-accepting substrate',
    encodedValues: {
      1: 'Carbon Cloth',
      2: 'Carbon Felt',
      3: 'Graphite Brush',
      4: 'Carbon Paper',
      5: 'Graphite Plate',
    },
    minTypical: 1,
    maxTypical: 5,
  },
  {
    name: 'Cathode Material',
    key: 'cathode_material',
    unit: 'category (1-5)',
    category: 'Material/Design',
    description: 'Terminal electron acceptor catalyst interface',
    encodedValues: {
      1: 'Pt/C on Carbon Cloth',
      2: 'Activated Carbon (Air-Cathode)',
      3: 'MnO2 / Metal Oxide Catalyst',
      4: 'Biocathode',
      5: 'Plain Graphite/Carbon',
    },
    minTypical: 1,
    maxTypical: 5,
  },
  {
    name: 'Membrane Separator',
    key: 'membrane',
    unit: 'category (1-5)',
    category: 'Material/Design',
    description: 'Proton exchange separator between chambers',
    encodedValues: {
      1: 'Nafion 117 (PEM)',
      2: 'Ultrex CMI-7000 (CEM)',
      3: 'Membrane-less / J-Cloth',
      4: 'Anion Exchange (AEM)',
      5: 'Porous Ceramic / Porcelain',
    },
    minTypical: 1,
    maxTypical: 5,
  },
  {
    name: 'Substrate (Fuel)',
    key: 'substrate',
    unit: 'category (1-5)',
    category: 'Operational',
    description: 'Carbon source for microbial catabolism',
    encodedValues: {
      1: 'Sodium Acetate',
      2: 'D-Glucose',
      3: 'Domestic Wastewater',
      4: 'Brewery/Food Effluent',
      5: 'Synthetic Wastewater',
    },
    minTypical: 1,
    maxTypical: 5,
  },
  {
    name: 'Chemical Oxygen Demand',
    key: 'COD_mgL',
    unit: 'mg/L',
    category: 'Operational',
    description: 'Influent organic loading concentration',
    minTypical: 200,
    maxTypical: 4000,
  },
  {
    name: 'Electrolyte pH',
    key: 'pH',
    unit: 'pH units',
    category: 'Operational',
    description: 'Anolyte proton concentration',
    minTypical: 5.5,
    maxTypical: 9.0,
  },
  {
    name: 'Temperature',
    key: 'temperature_C',
    unit: '°C',
    category: 'Operational',
    description: 'Operating thermal environment',
    minTypical: 15,
    maxTypical: 40,
  },
  {
    name: 'Electrode Projected Area',
    key: 'electrode_area_cm2',
    unit: 'cm²',
    category: 'Material/Design',
    description: 'Projected geometric area of anode/cathode',
    minTypical: 2,
    maxTypical: 200,
  },
  {
    name: 'Reactor Working Volume',
    key: 'reactor_volume_mL',
    unit: 'mL',
    category: 'Material/Design',
    description: 'Active liquid chamber volume',
    minTypical: 10,
    maxTypical: 1000,
  },
  {
    name: 'Coulombic Efficiency',
    key: 'coulombic_efficiency_pct',
    unit: '%',
    category: 'Electrochemical',
    description: 'Fraction of electrons recovered as current vs. theoretical',
    minTypical: 5,
    maxTypical: 85,
  },
  {
    name: 'Internal Resistance',
    key: 'internal_resistance_ohm',
    unit: 'Ω',
    category: 'Electrochemical',
    description: 'Sum of ohmic, charge-transfer, and diffusion resistances',
    minTypical: 15,
    maxTypical: 800,
  },
  {
    name: 'Power Density (Target)',
    key: 'power_density_mWm2',
    unit: 'mW/m²',
    category: 'Target',
    description: 'Maximum areal power output from polarization curve',
    minTypical: 50,
    maxTypical: 2500,
  },
];

export interface ModelMetrics {
  name: string;
  r2_train: number;
  r2_test: number;
  rmse_test: number;
  mae_test: number;
  cv_r2_mean: number;
  cv_r2_std: number;
  predictions: { id: number; actual: number; predicted: number; residual: number }[];
  featureImportance: { feature: FeatureKey; label: string; importance: number }[];
}

export interface HyperparameterConfig {
  rf_n_estimators: number;
  rf_max_depth: number;
  rf_min_samples_split: number;
  gb_n_estimators: number;
  gb_learning_rate: number;
  gb_max_depth: number;
  cv_folds: number;
  use_loocv: boolean;
}

export interface PaperSectionInputs {
  bestModelName: string;
  bestR2: number;
  bestRMSE: number;
  bestMAE: number;
  datasetSize: number;
  cvStrategy: string;
  topFeatures: string[];
  bestParams: string;
  r2Linear: number;
  r2RF: number;
  r2GB: number;
}
