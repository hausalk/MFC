export interface ErrorDiagnosis {
  errorType: string;
  cause: string;
  solution: string;
  correctedCodeSnippet: string;
  bioelectrochemicalContext: string;
}

export const COMMON_COLAB_ERRORS: Record<string, ErrorDiagnosis> = {
  nan_values: {
    errorType: "ValueError: Input contains NaN, infinity or a value too large for dtype('float64')",
    cause: 'Your MFC dataset has missing values (NaN) in one or more feature columns (e.g. unmeasured internal resistance or missing COD concentrations in literature papers). Scikit-learn regressors do not accept raw NaNs.',
    solution: 'Impute missing values using pandas median or scikit-learn SimpleImputer before passing X to model.fit(). For MFC data, median imputation is preferred over mean because COD and internal resistance often exhibit heavy right-skew.',
    correctedCodeSnippet: `# 1. Inspect which columns have NaNs
print(df.isnull().sum())

# 2. Impute with column medians
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy='median')
X_imputed = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# Or directly in pandas:
X = X.fillna(X.median(numeric_only=True))`,
    bioelectrochemicalContext: 'In MFC literature meta-analyses, internal resistance (R_int) and Coulombic Efficiency (CE) are frequently missing because older publications did not perform Electrochemical Impedance Spectroscopy (EIS) or complete chemical mass balances.',
  },
  classifier_instead_of_regressor: {
    errorType: "ValueError: Unknown label type: 'continuous'",
    cause: "You mistakenly initialized a Classification model (e.g., RandomForestClassifier, GradientBoostingClassifier, LogisticRegression) on continuous numerical power density (mW/m²) instead of a Regressor.",
    solution: "Replace the classifier class with its regression counterpart (e.g., RandomForestRegressor, GradientBoostingRegressor, Ridge/LinearRegression).",
    correctedCodeSnippet: `# ❌ INCORRECT (Classifier expects discrete class labels):
# from sklearn.ensemble import RandomForestClassifier
# model = RandomForestClassifier()

# ✅ CORRECT (MFC power density is continuous target):
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
model.fit(X_train, y_train)`,
    bioelectrochemicalContext: 'Power density is an analog continuous physical variable (W/m² or mW/m²) derived from the maximum point on the polarization curve (P = I × V), requiring regression algorithms.',
  },
  inconsistent_samples: {
    errorType: "ValueError: Found input variables with inconsistent numbers of samples: [80, 75]",
    cause: 'The number of rows in feature matrix X does not match the number of labels in target vector y. This typically happens if you filtered NaNs or outliers from X without filtering the corresponding rows in y, or did an unaligned train_test_split.',
    solution: 'Filter X and y together on the full DataFrame before separating predictors and target.',
    correctedCodeSnippet: `# ❌ INCORRECT:
# X = X.dropna() # y still has original length!

# ✅ CORRECT:
# Clean the entire DataFrame first:
df_clean = df.dropna(subset=['power_density_mWm2'] + features)
X = df_clean[features]
y = df_clean['power_density_mWm2']

print(f"Verified lengths: len(X)={len(X)}, len(y)={len(y)}")`,
    bioelectrochemicalContext: 'Every MFC experiment extracted from literature must maintain pair-wise integrity between architectural inputs (electrode area, volume) and electrochemical outputs (power density).',
  },
  key_error: {
    errorType: "KeyError: 'power_density_mWm2'",
    cause: "The column name in your CSV does not match the exact string 'power_density_mWm2'. There might be trailing spaces, capitalized letters (e.g. 'Power_Density_mWm2'), or unit formatting differences ('Power (mW/m2)').",
    solution: "Strip leading/trailing whitespace from column names and normalize them to lower-case snake_case.",
    correctedCodeSnippet: `# Strip whitespace and clean column names:
df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('(', '').str.replace(')', '')
print("Detected columns:", df.columns.tolist())

# Check your target column:
target_col = [c for c in df.columns if 'power' in c][0]
print("Mapped target column:", target_col)
y = df[target_col]`,
    bioelectrochemicalContext: 'Different research groups report power density in various units: mW/m² (areal, anode normalized), mW/m³ (volumetric, liquid volume normalized), or mW (absolute total power). Make sure your dataset is standardized to areal mW/m².',
  },
  string_conversion: {
    errorType: "TypeError: unsupported operand type(s) for -: 'str' and 'int' / ValueError: could not convert string to float",
    cause: 'One or more columns contain string values (e.g. "Nafion 117", "Acetate", or numbers with text units like "800 mg/L"). Machine learning models require all inputs to be numeric.',
    solution: 'Remove string units or apply categorical encoding (e.g., LabelEncoder, One-Hot Encoding, or map dictionary) to convert text categories into integers 1-5.',
    correctedCodeSnippet: `# If values have units like "800 mg/L", strip text:
df['COD_mgL'] = df['COD_mgL'].astype(str).str.replace('mg/L', '').str.strip().astype(float)

# If categorical columns contain text strings, map to integers:
substrate_mapping = {'Acetate': 1, 'Glucose': 2, 'Wastewater': 3, 'Brewery': 4, 'Synthetic': 5}
df['substrate'] = df['substrate'].map(substrate_mapping).fillna(5)`,
    bioelectrochemicalContext: 'MFC literature uses descriptive material names (e.g., "Carbon cloth 30wt% PTFE wet-proofed", "Ultrex CMI-7000"). These must be categorized into standard functional material tiers for ML modeling.',
  },
  overfitting_cv: {
    errorType: "Model shows R²=0.98 on Train but R²=-0.15 on Test / Cross-Validation",
    cause: 'Extreme overfitting due to small sample size (N=30–80) with complex decision trees (max_depth too large) or data leakage during scaling/feature selection.',
    solution: 'Constrain tree complexity (set max_depth=3 or 4, min_samples_split=5), use 5-fold cross-validation or Leave-One-Out CV (LOOCV), and fit StandardScaler strictly inside each CV fold or pipeline.',
    correctedCodeSnippet: `from sklearn.pipeline import make_pipeline

# Constrain model capacity for small N=30-80 datasets:
model = make_pipeline(
    StandardScaler(),
    RandomForestRegressor(
        n_estimators=100,
        max_depth=4,            # Prevent tree from memorizing small sample
        min_samples_split=4,    # Require multiple literature points per split
        min_samples_leaf=2,
        random_state=42
    )
)`,
    bioelectrochemicalContext: 'With limited literature datasets (N<100), high-variance models overfit noise from differing laboratory protocols (e.g., agitation speed, inoculation source, cathode moisture). Small max_depth forces the tree to capture generalizable electrochemical trends.',
  },
};

export async function diagnoseColabError(errorText: string): Promise<ErrorDiagnosis> {
  const lower = errorText.toLowerCase();

  if (lower.includes('nan') || lower.includes('infinity') || lower.includes('null')) {
    return COMMON_COLAB_ERRORS.nan_values;
  }
  if (lower.includes('unknown label type: \'continuous\'') || lower.includes('unknown label type: "continuous"') || (lower.includes('classifier') && lower.includes('continuous'))) {
    return COMMON_COLAB_ERRORS.classifier_instead_of_regressor;
  }
  if (lower.includes('inconsistent numbers of samples') || lower.includes('found input variables with inconsistent')) {
    return COMMON_COLAB_ERRORS.inconsistent_samples;
  }
  if (lower.includes('keyerror') || lower.includes('power_density')) {
    return COMMON_COLAB_ERRORS.key_error;
  }
  if (lower.includes('could not convert string') || lower.includes('unsupported operand type') || lower.includes('str and int')) {
    return COMMON_COLAB_ERRORS.string_conversion;
  }
  if (lower.includes('overfitting') || lower.includes('negative r2') || lower.includes('r2 < 0')) {
    return COMMON_COLAB_ERRORS.overfitting_cv;
  }

  // Attempt server-side Gemini API call for custom stack traces
  try {
    const res = await fetch('/api/gemini/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Diagnose this Python/Colab/Scikit-learn error encountered by a Microbial Fuel Cell (MFC) researcher training regression models (Linear Regression, Random Forest, Gradient Boosting) on a 30-80 row dataset:
Error Traceback:
${errorText}

Respond with:
1. Exact root cause in scikit-learn / pandas
2. Corrected code snippet
3. Bioelectrochemical context why this happens in MFC literature data`,
        systemInstruction:
          'You are a senior bioelectrochemistry machine learning engineer and Python debugger. Keep explanations precise and provide actionable, clean code snippets.',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return {
          errorType: 'Python / Colab Traceback Diagnosis',
          cause: 'Identified from stack trace.',
          solution: data.text,
          correctedCodeSnippet: '# See solution explanation above for exact snippet',
          bioelectrochemicalContext: 'Related to data alignment or bioelectrochemical feature scaling.',
        };
      }
    }
  } catch (e) {
    console.warn('Gemini error assistant not available:', e);
  }

  // Generic fallback diagnosis
  return {
    errorType: 'General Scikit-Learn / Colab Execution Issue',
    cause: 'The execution encountered an unexpected data type, dimension mismatch, or missing dependency.',
    solution: 'Verify that all feature columns are numeric, contain zero NaNs (or have been imputed with median), and that X and y have matching row counts.',
    correctedCodeSnippet: `# Quick health check:
print("X shape:", X.shape)
print("y shape:", y.shape)
print("X dtypes:\\n", X.dtypes)
print("NaN count in X:", X.isnull().sum().sum())
print("NaN count in y:", y.isnull().sum())`,
    bioelectrochemicalContext: 'MFC datasets compiled from literature are prone to heterogeneous units and non-standard reporting across different authors.',
  };
}
