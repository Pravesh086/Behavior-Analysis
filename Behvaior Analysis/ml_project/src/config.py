from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = ROOT_DIR / "ml_project"
ARTIFACTS_DIR = PROJECT_DIR / "artifacts"
EXAMPLES_DIR = PROJECT_DIR / "examples"

RESAMPLED_DATA_PATH = ROOT_DIR / "resampled_data.csv"
ORIGINAL_DATA_PATH = ROOT_DIR / "mldata.csv"
LEGACY_NOTEBOOKS = [ROOT_DIR / "cnn.ipynb", ROOT_DIR / "ml.ipynb"]

TARGET_COL = "Suggested Job Role"
RANDOM_STATE = 42

TRAINED_BUNDLE_PATH = ARTIFACTS_DIR / "best_model.joblib"
MODEL_REPORT_PATH = ARTIFACTS_DIR / "model_report.json"
FEATURE_IMPORTANCE_PATH = ARTIFACTS_DIR / "feature_importance.csv"
SAMPLE_PREDICTIONS_PATH = ARTIFACTS_DIR / "sample_predictions.csv"
SAMPLE_INPUT_PATH = EXAMPLES_DIR / "sample_input.json"
