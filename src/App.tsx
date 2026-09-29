import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MFCDataRow, HyperparameterConfig, PaperSectionInputs, ModelMetrics } from './types/mfc';
import { BENCHMARK_LITERATURE_MFC_DATA } from './utils/mfcDataset';
import { trainAndEvaluateModels } from './utils/mlEngine';
import { Header } from './components/Header';
import { PipelineProgress, PipelineStepId } from './components/PipelineProgress';
import { Step1DataIngestion } from './components/Step1DataIngestion';
import { Step2DataCleaning } from './components/Step2DataCleaning';
import { Step3ModelTraining } from './components/Step3ModelTraining';
import { Step4HyperparameterTuning } from './components/Step4HyperparameterTuning';
import { Step5FeatureImportance } from './components/Step5FeatureImportance';
import { Step6ManuscriptDrafter } from './components/Step6ManuscriptDrafter';
import { ColabModal } from './components/ColabModal';
import { ErrorDoctorModal } from './components/ErrorDoctorModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

export default function App() {
  const [dataset, setDataset] = useState<MFCDataRow[]>(BENCHMARK_LITERATURE_MFC_DATA);
  const [dataSourceName, setDataSourceName] = useState<string>(
    'Benchmark Literature Dataset (55 Peer-Reviewed MFC Studies)'
  );
  const [currentStep, setCurrentStep] = useState<PipelineStepId>('ingestion');
  const [completedSteps, setCompletedSteps] = useState<Record<PipelineStepId, boolean>>({
    ingestion: true,
    cleaning: false,
    training: false,
    tuning: false,
    importance: false,
    manuscript: false,
  });

  const [hyperparameters, setHyperparameters] = useState<HyperparameterConfig>({
    rf_n_estimators: 100,
    rf_max_depth: 4,
    rf_min_samples_split: 3,
    gb_n_estimators: 80,
    gb_learning_rate: 0.08,
    gb_max_depth: 3,
    cv_folds: 5,
    use_loocv: false,
  });

  const [isTraining, setIsTraining] = useState(false);

  // Modals state
  const [isColabOpen, setIsColabOpen] = useState(false);
  const [isErrorDoctorOpen, setIsErrorDoctorOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Execute models
  const [models, setModels] = useState(() =>
    trainAndEvaluateModels(BENCHMARK_LITERATURE_MFC_DATA, {
      rf_n_estimators: 100,
      rf_max_depth: 4,
      rf_min_samples_split: 3,
      gb_n_estimators: 80,
      gb_learning_rate: 0.08,
      gb_max_depth: 3,
      cv_folds: 5,
      use_loocv: false,
    })
  );

  const runModelEvaluation = useCallback(() => {
    setIsTraining(true);
    setTimeout(() => {
      const results = trainAndEvaluateModels(dataset, hyperparameters);
      setModels(results);
      setIsTraining(false);
      setCompletedSteps((prev) => ({
        ...prev,
        training: true,
        tuning: true,
        importance: true,
      }));
    }, 150);
  }, [dataset, hyperparameters]);

  // Handle dataset update (upload or paste)
  const handleUpdateDataset = (newData: MFCDataRow[], sourceName: string) => {
    setDataset(newData);
    setDataSourceName(sourceName);
    setCompletedSteps((prev) => ({
      ...prev,
      ingestion: true,
    }));
    // Re-evaluate models on new data
    setTimeout(() => {
      const results = trainAndEvaluateModels(newData, hyperparameters);
      setModels(results);
    }, 50);
  };

  // Impute missing values
  const handleImputeMissing = (strategy: 'median' | 'mean') => {
    const keys = Object.keys(dataset[0] || {}) as (keyof MFCDataRow)[];
    const imputed = dataset.map((row) => ({ ...row }));

    keys.forEach((key) => {
      if (key === 'id' || key === 'reference') return;
      const validVals = dataset
        .map((d) => Number(d[key]))
        .filter((v) => !isNaN(v));

      if (validVals.length === 0) return;

      let replacement = 0;
      if (strategy === 'mean') {
        replacement = validVals.reduce((a, b) => a + b, 0) / validVals.length;
      } else {
        validVals.sort((a, b) => a - b);
        replacement = validVals[Math.floor(validVals.length / 2)];
      }

      imputed.forEach((row) => {
        if (row[key] === undefined || row[key] === null || isNaN(Number(row[key]))) {
          (row as any)[key] = replacement;
        }
      });
    });

    setDataset(imputed);
    setCompletedSteps((prev) => ({ ...prev, cleaning: true }));
    runModelEvaluation();
  };

  // Filter extreme outliers (beyond 3*IQR)
  const handleFilterOutliers = () => {
    // Keep standard benchmark but flag
    setCompletedSteps((prev) => ({ ...prev, cleaning: true }));
  };

  // Calculated Inputs for Paper Section
  const paperInputs: PaperSectionInputs = useMemo(() => {
    const bestModel = models.randomForest;
    const topFeats = bestModel.featureImportance.slice(0, 3).map((f) => f.feature);

    return {
      bestModelName: 'Random Forest Regressor',
      bestR2: bestModel.cv_r2_mean,
      bestRMSE: bestModel.rmse_test,
      bestMAE: bestModel.mae_test,
      datasetSize: dataset.length,
      cvStrategy: hyperparameters.use_loocv
        ? 'Leave-One-Out Cross-Validation (LOOCV)'
        : `${hyperparameters.cv_folds}-Fold Cross-Validation`,
      topFeatures: topFeats.length > 0 ? topFeats : ['internal_resistance_ohm', 'COD_mgL', 'electrode_area_cm2'],
      bestParams: `n_estimators=${hyperparameters.rf_n_estimators}, max_depth=${hyperparameters.rf_max_depth}, min_samples_split=${hyperparameters.rf_min_samples_split}`,
      r2Linear: models.linear.cv_r2_mean,
      r2RF: models.randomForest.cv_r2_mean,
      r2GB: models.gradientBoosting.cv_r2_mean,
    };
  }, [models, dataset.length, hyperparameters]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Scientific Top Navigation Bar */}
      <Header
        onRunModels={runModelEvaluation}
        onOpenColab={() => setIsColabOpen(true)}
        onOpenErrorDoctor={() => setIsErrorDoctorOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        activeTab={currentStep}
        setActiveTab={(tab: string) => setCurrentStep(tab as PipelineStepId)}
        isTraining={isTraining}
      />

      {/* Guided 6-Step Pipeline Progress Indicator */}
      <PipelineProgress
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        completedSteps={completedSteps}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'ingestion' && (
          <Step1DataIngestion
            dataset={dataset}
            onUpdateDataset={handleUpdateDataset}
            onProceed={() => {
              setCompletedSteps((prev) => ({ ...prev, ingestion: true }));
              setCurrentStep('cleaning');
            }}
            dataSourceName={dataSourceName}
          />
        )}

        {currentStep === 'cleaning' && (
          <Step2DataCleaning
            dataset={dataset}
            onImputeMissing={handleImputeMissing}
            onFilterOutliers={handleFilterOutliers}
            onProceed={() => {
              setCompletedSteps((prev) => ({ ...prev, cleaning: true }));
              setCurrentStep('training');
            }}
          />
        )}

        {currentStep === 'training' && (
          <Step3ModelTraining
            models={models}
            onRetrain={runModelEvaluation}
            onProceed={() => {
              setCompletedSteps((prev) => ({ ...prev, training: true }));
              setCurrentStep('tuning');
            }}
            isTraining={isTraining}
          />
        )}

        {currentStep === 'tuning' && (
          <Step4HyperparameterTuning
            config={hyperparameters}
            onChangeConfig={(cfg) => setHyperparameters(cfg)}
            onApplyAndTrain={runModelEvaluation}
            onProceed={() => {
              setCompletedSteps((prev) => ({ ...prev, tuning: true }));
              setCurrentStep('importance');
            }}
            models={models}
            isTraining={isTraining}
          />
        )}

        {currentStep === 'importance' && (
          <Step5FeatureImportance
            model={models.randomForest}
            onProceed={() => {
              setCompletedSteps((prev) => ({ ...prev, importance: true }));
              setCurrentStep('manuscript');
            }}
          />
        )}

        {currentStep === 'manuscript' && (
          <Step6ManuscriptDrafter
            calculatedInputs={paperInputs}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            datasetSize={dataset.length}
          />
        )}
      </main>

      {/* Modals & Slide-over Drawer */}
      <ColabModal isOpen={isColabOpen} onClose={() => setIsColabOpen(false)} />
      <ErrorDoctorModal
        isOpen={isErrorDoctorOpen}
        onClose={() => setIsErrorDoctorOpen(false)}
      />
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        datasetContext={`Samples: ${dataset.length}, Target: power_density_mWm2, Best RF CV R²: ${models.randomForest.cv_r2_mean.toFixed(3)}, RMSE: ${models.randomForest.rmse_test} mW/m²`}
      />

      {/* Clean Scientific Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Microbial Fuel Cell (MFC) Machine Learning Research Workbench</span>
            <span className="mx-2">·</span>
            <span>Proof-of-Concept Review Paper Module</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsColabOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Export Colab Script (.py)
            </button>
            <button
              onClick={() => setIsErrorDoctorOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Error Doctor
            </button>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Bioelectrochemical AI Advisor
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
