import { MFCDataRow, FeatureKey, ModelMetrics, HyperparameterConfig, MFC_COLUMNS_METADATA } from '../types/mfc';

export const FEATURE_KEYS: FeatureKey[] = [
  'anode_material',
  'cathode_material',
  'membrane',
  'substrate',
  'COD_mgL',
  'pH',
  'temperature_C',
  'electrode_area_cm2',
  'reactor_volume_mL',
  'coulombic_efficiency_pct',
  'internal_resistance_ohm',
];

// Helper: Standardize features (Z-score normalization)
export function standardize(X: number[][]): {
  scaled: number[][];
  means: number[];
  stds: number[];
} {
  const n = X.length;
  const p = X[0].length;
  const means: number[] = new Array(p).fill(0);
  const stds: number[] = new Array(p).fill(0);

  for (let j = 0; j < p; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += X[i][j];
    means[j] = sum / n;

    let varSum = 0;
    for (let i = 0; i < n; i++) varSum += Math.pow(X[i][j] - means[j], 2);
    stds[j] = Math.sqrt(varSum / (n > 1 ? n - 1 : 1)) || 1e-6;
  }

  const scaled = X.map((row) => row.map((val, j) => (val - means[j]) / stds[j]));
  return { scaled, means, stds };
}

// Helper: Matrix transpose
function transpose(A: number[][]): number[][] {
  const m = A.length;
  const n = A[0].length;
  const res: number[][] = Array.from({ length: n }, () => new Array(m));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      res[j][i] = A[i][j];
    }
  }
  return res;
}

// Helper: Matrix multiplication
function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  const k = A[0].length;
  const n = B[0].length;
  const res: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let p = 0; p < k; p++) {
      const a = A[i][p];
      for (let j = 0; j < n; j++) {
        res[i][j] += a * B[p][j];
      }
    }
  }
  return res;
}

// Invert square matrix with Gauss-Jordan elimination
function invertMatrix(A: number[][]): number[][] | null {
  const n = A.length;
  const aug: number[][] = A.map((row, i) => {
    const eye = new Array(n).fill(0);
    eye[i] = 1;
    return [...row, ...eye];
  });

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = aug[i];
    aug[i] = aug[maxRow];
    aug[maxRow] = temp;

    const pivot = aug[i][i];
    if (Math.abs(pivot) < 1e-12) return null;

    for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivot;

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
      }
    }
  }

  return aug.map((row) => row.slice(n));
}

// Linear / Ridge Regression implementation
class RidgeRegressionModel {
  weights: number[] = [];
  intercept: number = 0;
  means: number[] = [];
  stds: number[] = [];
  yMean: number = 0;

  fit(X: number[][], y: number[], alpha: number = 0.5) {
    const n = X.length;
    const p = X[0].length;

    const { scaled, means, stds } = standardize(X);
    this.means = means;
    this.stds = stds;

    this.yMean = y.reduce((a, b) => a + b, 0) / n;
    const yCentered = y.map((v) => v - this.yMean);

    const Xt = transpose(scaled);
    const XtX = matMul(Xt, scaled);

    // Add ridge penalty lambda * I to avoid singular matrix
    for (let i = 0; i < p; i++) {
      XtX[i][i] += alpha;
    }

    const inv = invertMatrix(XtX);
    if (!inv) {
      // Fallback
      this.weights = new Array(p).fill(0);
      this.intercept = this.yMean;
      return;
    }

    // Xt * y
    const Xty: number[][] = Array.from({ length: p }, () => [0]);
    for (let i = 0; i < p; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += Xt[i][j] * yCentered[j];
      }
      Xty[i][0] = sum;
    }

    const beta = matMul(inv, Xty);
    this.weights = beta.map((row) => row[0]);
    this.intercept = this.yMean;
  }

  predict(X: number[][]): number[] {
    return X.map((row) => {
      let pred = this.intercept;
      for (let j = 0; j < row.length; j++) {
        const scaledVal = (row[j] - this.means[j]) / this.stds[j];
        pred += this.weights[j] * scaledVal;
      }
      return pred;
    });
  }
}

// Single Decision Tree Node for Regression
interface TreeNode {
  isLeaf: boolean;
  prediction?: number;
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

class RegressionTree {
  maxDepth: number;
  minSamplesSplit: number;
  root: TreeNode | null = null;

  constructor(maxDepth: number = 4, minSamplesSplit: number = 3) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
  }

  fit(X: number[][], y: number[], featureSubsample?: number) {
    this.root = this.buildTree(X, y, 0, featureSubsample);
  }

  private buildTree(X: number[][], y: number[], depth: number, featureSubsample?: number): TreeNode {
    const n = y.length;
    const mean = y.reduce((a, b) => a + b, 0) / n;

    if (depth >= this.maxDepth || n < this.minSamplesSplit || this.calculateVariance(y) < 1e-4) {
      return { isLeaf: true, prediction: mean };
    }

    const p = X[0].length;
    let featureIndices = Array.from({ length: p }, (_, i) => i);
    if (featureSubsample && featureSubsample < p) {
      featureIndices = featureIndices.sort(() => Math.random() - 0.5).slice(0, featureSubsample);
    }

    let bestVarReduction = -1;
    let bestFeature = -1;
    let bestThreshold = 0;
    const currentVar = this.calculateVariance(y) * n;

    for (const fIdx of featureIndices) {
      // Find candidate thresholds
      const vals = X.map((row) => row[fIdx]).sort((a, b) => a - b);
      const thresholds: number[] = [];
      const step = Math.max(1, Math.floor(n / 10));
      for (let i = step; i < n - step; i += step) {
        thresholds.push((vals[i] + vals[i + 1]) / 2);
      }

      for (const t of thresholds) {
        const leftY: number[] = [];
        const rightY: number[] = [];
        for (let i = 0; i < n; i++) {
          if (X[i][fIdx] <= t) leftY.push(y[i]);
          else rightY.push(y[i]);
        }
        if (leftY.length === 0 || rightY.length === 0) continue;

        const leftVar = this.calculateVariance(leftY) * leftY.length;
        const rightVar = this.calculateVariance(rightY) * rightY.length;
        const varReduction = currentVar - (leftVar + rightVar);

        if (varReduction > bestVarReduction) {
          bestVarReduction = varReduction;
          bestFeature = fIdx;
          bestThreshold = t;
        }
      }
    }

    if (bestFeature === -1 || bestVarReduction <= 0) {
      return { isLeaf: true, prediction: mean };
    }

    const leftX: number[][] = [];
    const leftY: number[] = [];
    const rightX: number[][] = [];
    const rightY: number[] = [];

    for (let i = 0; i < n; i++) {
      if (X[i][bestFeature] <= bestThreshold) {
        leftX.push(X[i]);
        leftY.push(y[i]);
      } else {
        rightX.push(X[i]);
        rightY.push(y[i]);
      }
    }

    return {
      isLeaf: false,
      featureIndex: bestFeature,
      threshold: bestThreshold,
      left: this.buildTree(leftX, leftY, depth + 1, featureSubsample),
      right: this.buildTree(rightX, rightY, depth + 1, featureSubsample),
    };
  }

  private calculateVariance(y: number[]): number {
    if (y.length <= 1) return 0;
    const mean = y.reduce((a, b) => a + b, 0) / y.length;
    return y.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / y.length;
  }

  predictOne(row: number[], node: TreeNode | null): number {
    if (!node) return 0;
    if (node.isLeaf) return node.prediction!;
    if (row[node.featureIndex!] <= node.threshold!) {
      return this.predictOne(row, node.left || null);
    }
    return this.predictOne(row, node.right || null);
  }

  predict(X: number[][]): number[] {
    return X.map((row) => this.predictOne(row, this.root));
  }
}

// Random Forest Regressor
class RandomForestModel {
  trees: RegressionTree[] = [];
  nEstimators: number;
  maxDepth: number;
  minSamplesSplit: number;

  constructor(nEstimators: number = 60, maxDepth: number = 5, minSamplesSplit: number = 3) {
    this.nEstimators = nEstimators;
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
  }

  fit(X: number[][], y: number[]) {
    const n = X.length;
    const p = X[0].length;
    const featureSubsample = Math.max(1, Math.floor(Math.sqrt(p)) + 1);

    this.trees = [];
    for (let t = 0; t < this.nEstimators; t++) {
      // Bootstrapping sample with replacement
      const bootX: number[][] = [];
      const bootY: number[] = [];
      for (let i = 0; i < n; i++) {
        const randIdx = Math.floor(Math.random() * n);
        bootX.push(X[randIdx]);
        bootY.push(y[randIdx]);
      }
      const tree = new RegressionTree(this.maxDepth, this.minSamplesSplit);
      tree.fit(bootX, bootY, featureSubsample);
      this.trees.push(tree);
    }
  }

  predict(X: number[][]): number[] {
    const allPreds = this.trees.map((tree) => tree.predict(X));
    return X.map((_, i) => {
      let sum = 0;
      for (let t = 0; t < this.trees.length; t++) {
        sum += allPreds[t][i];
      }
      return sum / this.trees.length;
    });
  }
}

// Gradient Boosting Regressor
class GradientBoostingModel {
  trees: RegressionTree[] = [];
  learningRate: number;
  nEstimators: number;
  maxDepth: number;
  basePrediction: number = 0;

  constructor(nEstimators: number = 60, learningRate: number = 0.08, maxDepth: number = 3) {
    this.nEstimators = nEstimators;
    this.learningRate = learningRate;
    this.maxDepth = maxDepth;
  }

  fit(X: number[][], y: number[]) {
    const n = y.length;
    this.basePrediction = y.reduce((a, b) => a + b, 0) / n;
    let currentPreds = new Array(n).fill(this.basePrediction);

    this.trees = [];
    for (let t = 0; t < this.nEstimators; t++) {
      // Residuals = y - currentPreds
      const residuals = y.map((val, i) => val - currentPreds[i]);
      const tree = new RegressionTree(this.maxDepth, 2);
      tree.fit(X, residuals);

      const treePreds = tree.predict(X);
      for (let i = 0; i < n; i++) {
        currentPreds[i] += this.learningRate * treePreds[i];
      }
      this.trees.push(tree);
    }
  }

  predict(X: number[][]): number[] {
    const n = X.length;
    let preds = new Array(n).fill(this.basePrediction);
    for (const tree of this.trees) {
      const treePreds = tree.predict(X);
      for (let i = 0; i < n; i++) {
        preds[i] += this.learningRate * treePreds[i];
      }
    }
    return preds;
  }
}

// Calculate R2, RMSE, MAE
export function calculateMetrics(actual: number[], predicted: number[]) {
  const n = actual.length;
  if (n === 0) return { r2: 0, rmse: 0, mae: 0 };

  const mean = actual.reduce((a, b) => a + b, 0) / n;
  let ssTot = 0;
  let ssRes = 0;
  let absErrSum = 0;

  for (let i = 0; i < n; i++) {
    const act = actual[i];
    const pred = predicted[i];
    ssTot += Math.pow(act - mean, 2);
    ssRes += Math.pow(act - pred, 2);
    absErrSum += Math.abs(act - pred);
  }

  const r2 = ssTot === 0 ? 0 : Math.max(0, 1 - ssRes / ssTot);
  const rmse = Math.sqrt(ssRes / n);
  const mae = absErrSum / n;

  return {
    r2: Number(r2.toFixed(3)),
    rmse: Number(rmse.toFixed(1)),
    mae: Number(mae.toFixed(1)),
  };
}

// Compute Permutation Feature Importance
export function calculatePermutationImportance(
  model: { predict: (X: number[][]) => number[] },
  X: number[][],
  y: number[]
): { feature: FeatureKey; label: string; importance: number }[] {
  const basePreds = model.predict(X);
  const baseMetrics = calculateMetrics(y, basePreds);
  const baseRMSE = baseMetrics.rmse;

  const results: { feature: FeatureKey; label: string; importance: number }[] = [];

  for (let f = 0; f < FEATURE_KEYS.length; f++) {
    // Permute column f
    const XPermuted = X.map((r) => [...r]);
    const colVals = X.map((r) => r[f]).sort(() => Math.random() - 0.5);
    for (let i = 0; i < X.length; i++) {
      XPermuted[i][f] = colVals[i];
    }

    const permPreds = model.predict(XPermuted);
    const permMetrics = calculateMetrics(y, permPreds);
    const importance = Math.max(0, permMetrics.rmse - baseRMSE);

    const meta = MFC_COLUMNS_METADATA.find((m) => m.key === FEATURE_KEYS[f])!;
    results.push({
      feature: FEATURE_KEYS[f],
      label: meta.name,
      importance,
    });
  }

  const total = results.reduce((acc, r) => acc + r.importance, 0) || 1;
  return results
    .map((r) => ({
      ...r,
      importance: Number((r.importance / total).toFixed(3)),
    }))
    .sort((a, b) => b.importance - a.importance);
}

// Main execution function running Cross-Validation and training models
export function trainAndEvaluateModels(
  data: MFCDataRow[],
  config: HyperparameterConfig
): {
  linear: ModelMetrics;
  randomForest: ModelMetrics;
  gradientBoosting: ModelMetrics;
} {
  // Extract features X and target y
  const validData = data.filter((d) => !isNaN(d.power_density_mWm2));
  const X = validData.map((row) => FEATURE_KEYS.map((k) => Number(row[k]) || 0));
  const y = validData.map((row) => Number(row.power_density_mWm2));
  const n = X.length;

  const kFolds = config.use_loocv ? n : Math.min(config.cv_folds || 5, n);
  const foldSize = Math.floor(n / kFolds);

  // K-Fold Cross Validation indices
  const indices = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5);

  const cvLinearR2: number[] = [];
  const cvRFR2: number[] = [];
  const cvGBR2: number[] = [];

  const linearTestPreds: number[] = new Array(n);
  const rfTestPreds: number[] = new Array(n);
  const gbTestPreds: number[] = new Array(n);

  for (let f = 0; f < kFolds; f++) {
    const testIndices = config.use_loocv
      ? [indices[f]]
      : indices.slice(f * foldSize, f === kFolds - 1 ? n : (f + 1) * foldSize);
    const trainIndices = indices.filter((idx) => !testIndices.includes(idx));

    const trainX = trainIndices.map((i) => X[i]);
    const trainY = trainIndices.map((i) => y[i]);
    const testX = testIndices.map((i) => X[i]);
    const testY = testIndices.map((i) => y[i]);

    // 1. Linear model
    const lr = new RidgeRegressionModel();
    lr.fit(trainX, trainY, 1.0);
    const predLR = lr.predict(testX);
    predLR.forEach((p, idx) => {
      linearTestPreds[testIndices[idx]] = p;
    });
    cvLinearR2.push(calculateMetrics(testY, predLR).r2);

    // 2. Random Forest
    const rf = new RandomForestModel(
      config.rf_n_estimators,
      config.rf_max_depth,
      config.rf_min_samples_split
    );
    rf.fit(trainX, trainY);
    const predRF = rf.predict(testX);
    predRF.forEach((p, idx) => {
      rfTestPreds[testIndices[idx]] = p;
    });
    cvRFR2.push(calculateMetrics(testY, predRF).r2);

    // 3. Gradient Boosting
    const gb = new GradientBoostingModel(
      config.gb_n_estimators,
      config.gb_learning_rate,
      config.gb_max_depth
    );
    gb.fit(trainX, trainY);
    const predGB = gb.predict(testX);
    predGB.forEach((p, idx) => {
      gbTestPreds[testIndices[idx]] = p;
    });
    cvGBR2.push(calculateMetrics(testY, predGB).r2);
  }

  // Full dataset fit for final feature importance and train metrics
  const fullLR = new RidgeRegressionModel();
  fullLR.fit(X, y, 1.0);
  const fullLRPreds = fullLR.predict(X);

  const fullRF = new RandomForestModel(
    config.rf_n_estimators,
    config.rf_max_depth,
    config.rf_min_samples_split
  );
  fullRF.fit(X, y);
  const fullRFPreds = fullRF.predict(X);

  const fullGB = new GradientBoostingModel(
    config.gb_n_estimators,
    config.gb_learning_rate,
    config.gb_max_depth
  );
  fullGB.fit(X, y);
  const fullGBPreds = fullGB.predict(X);

  const getCvStats = (vals: number[]) => {
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const std = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (vals.length || 1));
    return { mean: Number(mean.toFixed(3)), std: Number(std.toFixed(3)) };
  };

  const lrCV = getCvStats(cvLinearR2);
  const rfCV = getCvStats(cvRFR2);
  const gbCV = getCvStats(cvGBR2);

  const lrTestMetrics = calculateMetrics(y, linearTestPreds);
  const rfTestMetrics = calculateMetrics(y, rfTestPreds);
  const gbTestMetrics = calculateMetrics(y, gbTestPreds);

  const lrTrainMetrics = calculateMetrics(y, fullLRPreds);
  const rfTrainMetrics = calculateMetrics(y, fullRFPreds);
  const gbTrainMetrics = calculateMetrics(y, fullGBPreds);

  const buildPredItems = (preds: number[]) => {
    return validData.map((d, i) => {
      const predVal = Math.round(preds[i]);
      return {
        id: d.id,
        actual: d.power_density_mWm2,
        predicted: predVal,
        residual: d.power_density_mWm2 - predVal,
      };
    });
  };

  return {
    linear: {
      name: 'Ridge Linear Regression',
      r2_train: lrTrainMetrics.r2,
      r2_test: lrTestMetrics.r2,
      rmse_test: lrTestMetrics.rmse,
      mae_test: lrTestMetrics.mae,
      cv_r2_mean: lrCV.mean,
      cv_r2_std: lrCV.std,
      predictions: buildPredItems(linearTestPreds),
      featureImportance: calculatePermutationImportance(fullLR, X, y),
    },
    randomForest: {
      name: 'Random Forest Regressor',
      r2_train: rfTrainMetrics.r2,
      r2_test: rfTestMetrics.r2,
      rmse_test: rfTestMetrics.rmse,
      mae_test: rfTestMetrics.mae,
      cv_r2_mean: rfCV.mean,
      cv_r2_std: rfCV.std,
      predictions: buildPredItems(rfTestPreds),
      featureImportance: calculatePermutationImportance(fullRF, X, y),
    },
    gradientBoosting: {
      name: 'Gradient Boosting Regressor',
      r2_train: gbTrainMetrics.r2,
      r2_test: gbTestMetrics.r2,
      rmse_test: gbTestMetrics.rmse,
      mae_test: gbTestMetrics.mae,
      cv_r2_mean: gbCV.mean,
      cv_r2_std: gbCV.std,
      predictions: buildPredItems(gbTestPreds),
      featureImportance: calculatePermutationImportance(fullGB, X, y),
    },
  };
}
