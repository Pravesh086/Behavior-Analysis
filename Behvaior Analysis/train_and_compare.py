from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    f1_score,
    log_loss,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from xgboost import XGBClassifier


RANDOM_STATE = 42
DATA_PATH = Path("resampled_data.csv")
LEGACY_NOTEBOOKS = [Path("cnn.ipynb"), Path("ml.ipynb")]
ARTIFACTS_DIR = Path("artifacts")
TARGET_COL = "Suggested Job Role"


@dataclass
class SplitBundle:
    x_train: pd.DataFrame
    x_val: pd.DataFrame
    x_test: pd.DataFrame
    y_train: np.ndarray
    y_val: np.ndarray
    y_test: np.ndarray
    label_encoder: LabelEncoder
    class_names: list[str]
    numeric_cols: list[str]
    categorical_cols: list[str]


def load_source_dataframe(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    return df.drop_duplicates().reset_index(drop=True)


def make_splits(df: pd.DataFrame) -> SplitBundle:
    x = df.drop(columns=[TARGET_COL])
    y_raw = df[TARGET_COL].astype(str)

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(y_raw)

    x_train, x_temp, y_train, y_temp = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=RANDOM_STATE,
        stratify=y,
    )
    x_val, x_test, y_val, y_test = train_test_split(
        x_temp,
        y_temp,
        test_size=0.5,
        random_state=RANDOM_STATE,
        stratify=y_temp,
    )

    numeric_cols = x.select_dtypes(include=["number"]).columns.tolist()
    categorical_cols = [col for col in x.columns if col not in numeric_cols]

    return SplitBundle(
        x_train=x_train,
        x_val=x_val,
        x_test=x_test,
        y_train=y_train,
        y_val=y_val,
        y_test=y_test,
        label_encoder=label_encoder,
        class_names=label_encoder.classes_.tolist(),
        numeric_cols=numeric_cols,
        categorical_cols=categorical_cols,
    )


def build_preprocessor(numeric_cols: list[str], categorical_cols: list[str]) -> ColumnTransformer:
    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
        ]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    return ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, numeric_cols),
            ("cat", categorical_pipeline, categorical_cols),
        ]
    )


def build_candidate_models(n_classes: int) -> dict[str, Any]:
    return {
        "logistic_regression": LogisticRegression(max_iter=4000, random_state=RANDOM_STATE),
        "random_forest": RandomForestClassifier(
            n_estimators=700,
            max_depth=None,
            min_samples_leaf=1,
            random_state=RANDOM_STATE,
            n_jobs=1,
            class_weight="balanced_subsample",
        ),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=900,
            max_depth=None,
            min_samples_leaf=1,
            random_state=RANDOM_STATE,
            n_jobs=1,
            class_weight="balanced",
        ),
        "xgboost": XGBClassifier(
            objective="multi:softprob",
            num_class=n_classes,
            n_estimators=600,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.9,
            colsample_bytree=0.9,
            reg_lambda=1.0,
            min_child_weight=1,
            tree_method="hist",
            eval_metric="mlogloss",
            random_state=RANDOM_STATE,
            n_jobs=1,
        ),
    }


def build_pipeline(preprocessor: ColumnTransformer, estimator: Any) -> Pipeline:
    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", estimator),
        ]
    )


def compute_metrics(
    model: Pipeline,
    x: pd.DataFrame,
    y: np.ndarray,
    class_names: list[str],
) -> dict[str, Any]:
    y_pred = model.predict(x)
    metrics = {
        "accuracy": float(accuracy_score(y, y_pred)),
        "balanced_accuracy": float(balanced_accuracy_score(y, y_pred)),
        "macro_f1": float(f1_score(y, y_pred, average="macro")),
        "macro_precision": float(precision_score(y, y_pred, average="macro", zero_division=0)),
        "macro_recall": float(recall_score(y, y_pred, average="macro", zero_division=0)),
        "classification_report": classification_report(
            y,
            y_pred,
            target_names=class_names,
            output_dict=True,
            zero_division=0,
        ),
    }
    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(x)
        metrics["log_loss"] = float(log_loss(y, y_proba, labels=list(range(len(class_names)))))
    return metrics


def extract_legacy_scores() -> dict[str, Any]:
    legacy: dict[str, Any] = {
        "source": "notebook_reported_metrics",
        "note": (
            "Legacy models are preserved on disk. Scores were extracted from notebook outputs because "
            "the saved TensorFlow artifacts cannot be reloaded in the current environment."
        ),
    }
    patterns = {
        "cnn_test_accuracy": re.compile(r"Test Accuracy:\s*([0-9.]+)"),
        "cnn_test_loss": re.compile(r"Test Loss:\s*([0-9.]+)"),
        "hybrid_accuracy": re.compile(r"accuracy\s+0\.93\b"),
        "legacy_xgboost_accuracy": re.compile(r"accuracy\s+0\.909583\b"),
        "legacy_random_forest_accuracy": re.compile(r"accuracy\s+0\.995833\b"),
        "legacy_tabnet_accuracy": re.compile(r"accuracy\s+0\.288750\b"),
    }

    for notebook_path in LEGACY_NOTEBOOKS:
        if not notebook_path.exists():
            continue
        text = notebook_path.read_text(encoding="utf-8")
        if "cnn_test_accuracy" not in legacy:
            match = patterns["cnn_test_accuracy"].search(text)
            if match:
                legacy["cnn_test_accuracy"] = float(match.group(1))
        if "cnn_test_loss" not in legacy:
            match = patterns["cnn_test_loss"].search(text)
            if match:
                legacy["cnn_test_loss"] = float(match.group(1))
        if "hybrid_accuracy" not in legacy and patterns["hybrid_accuracy"].search(text):
            legacy["hybrid_accuracy"] = 0.93
        if "legacy_xgboost_accuracy" not in legacy and patterns["legacy_xgboost_accuracy"].search(text):
            legacy["legacy_xgboost_accuracy"] = 0.909583
        if "legacy_random_forest_accuracy" not in legacy and patterns["legacy_random_forest_accuracy"].search(text):
            legacy["legacy_random_forest_accuracy"] = 0.995833
        if "legacy_tabnet_accuracy" not in legacy and patterns["legacy_tabnet_accuracy"].search(text):
            legacy["legacy_tabnet_accuracy"] = 0.28875
    return legacy


def benchmark_models(split_bundle: SplitBundle) -> tuple[list[dict[str, Any]], str]:
    results: list[dict[str, Any]] = []
    candidate_models = build_candidate_models(len(split_bundle.class_names))

    for model_name, estimator in candidate_models.items():
        preprocessor = build_preprocessor(split_bundle.numeric_cols, split_bundle.categorical_cols)
        pipeline = build_pipeline(preprocessor, estimator)
        pipeline.fit(split_bundle.x_train, split_bundle.y_train)
        val_metrics = compute_metrics(
            pipeline,
            split_bundle.x_val,
            split_bundle.y_val,
            split_bundle.class_names,
        )
        results.append(
            {
                "model_name": model_name,
                "validation_metrics": val_metrics,
                "estimator_params": estimator.get_params(),
            }
        )

    results.sort(
        key=lambda item: (
            item["validation_metrics"]["macro_f1"],
            item["validation_metrics"]["accuracy"],
        ),
        reverse=True,
    )
    return results, results[0]["model_name"]


def train_best_model(split_bundle: SplitBundle, best_model_name: str) -> tuple[Pipeline, dict[str, Any]]:
    candidate_models = build_candidate_models(len(split_bundle.class_names))
    best_estimator = candidate_models[best_model_name]
    best_pipeline = build_pipeline(
        build_preprocessor(split_bundle.numeric_cols, split_bundle.categorical_cols),
        best_estimator,
    )

    x_train_full = pd.concat([split_bundle.x_train, split_bundle.x_val], axis=0)
    y_train_full = np.concatenate([split_bundle.y_train, split_bundle.y_val], axis=0)

    best_pipeline.fit(x_train_full, y_train_full)
    test_metrics = compute_metrics(
        best_pipeline,
        split_bundle.x_test,
        split_bundle.y_test,
        split_bundle.class_names,
    )
    return best_pipeline, test_metrics


def main() -> None:
    ARTIFACTS_DIR.mkdir(exist_ok=True)

    source_df = load_source_dataframe(DATA_PATH)
    split_bundle = make_splits(source_df)
    benchmark_results, best_model_name = benchmark_models(split_bundle)
    best_pipeline, test_metrics = train_best_model(split_bundle, best_model_name)
    legacy_scores = extract_legacy_scores()

    model_path = ARTIFACTS_DIR / "best_model.joblib"
    report_path = ARTIFACTS_DIR / "model_report.json"
    prediction_sample_path = ARTIFACTS_DIR / "sample_predictions.csv"

    joblib.dump(
        {
            "pipeline": best_pipeline,
            "class_names": split_bundle.class_names,
            "feature_columns": split_bundle.x_train.columns.tolist(),
            "target_column": TARGET_COL,
        },
        model_path,
        compress=3,
    )

    sample_predictions = split_bundle.x_test.head(20).copy()
    sample_predictions["true_label"] = split_bundle.label_encoder.inverse_transform(split_bundle.y_test[:20])
    sample_predictions["predicted_label"] = split_bundle.label_encoder.inverse_transform(
        best_pipeline.predict(split_bundle.x_test.head(20))
    )
    sample_predictions.to_csv(prediction_sample_path, index=False)

    report = {
        "dataset": {
            "source_file": str(DATA_PATH),
            "rows_after_dedup": int(len(source_df)),
            "num_features": int(split_bundle.x_train.shape[1]),
            "num_classes": int(len(split_bundle.class_names)),
            "class_names": split_bundle.class_names,
            "split_sizes": {
                "train": int(len(split_bundle.x_train)),
                "validation": int(len(split_bundle.x_val)),
                "test": int(len(split_bundle.x_test)),
            },
        },
        "changes_applied": [
            "dropped duplicates before splitting",
            "used stratified train/validation/test split",
            "fit preprocessing only inside the pipeline to prevent leakage",
            "used the encoded numeric training table that the legacy notebooks actually learned from",
            "benchmarked multiple tabular algorithms and selected the best by validation macro F1",
            "retrained the winning model on train+validation and evaluated once on held-out test data",
            "saved the trained pipeline and class labels with joblib",
        ],
        "algorithm_choice": {
            "selected_model": best_model_name,
            "selection_reason": (
                "The selected algorithm achieved the strongest validation macro F1 on structured tabular data "
                "with mixed numeric and categorical features."
            ),
        },
        "benchmark_results": benchmark_results,
        "final_test_metrics": test_metrics,
        "legacy_scores": legacy_scores,
        "comparison": {
            "compared_against": "legacy_cnn_test_accuracy",
            "legacy_accuracy": legacy_scores.get("cnn_test_accuracy"),
            "fresh_accuracy": test_metrics["accuracy"],
            "accuracy_delta": None
            if legacy_scores.get("cnn_test_accuracy") is None
            else float(test_metrics["accuracy"] - legacy_scores["cnn_test_accuracy"]),
        },
        "artifacts": {
            "best_model": str(model_path),
            "sample_predictions": str(prediction_sample_path),
        },
    }

    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Selected model: {best_model_name}")
    print(f"Test accuracy: {test_metrics['accuracy']:.4f}")
    print(f"Test macro F1: {test_metrics['macro_f1']:.4f}")
    print(f"Test balanced accuracy: {test_metrics['balanced_accuracy']:.4f}")
    if "log_loss" in test_metrics:
        print(f"Test log loss: {test_metrics['log_loss']:.4f}")
    legacy_accuracy = legacy_scores.get("cnn_test_accuracy")
    if legacy_accuracy is not None:
        print(f"Legacy CNN accuracy: {legacy_accuracy:.4f}")
        print(f"Accuracy delta: {test_metrics['accuracy'] - legacy_accuracy:+.4f}")
    print(f"Artifacts written to: {ARTIFACTS_DIR}")


if __name__ == "__main__":
    main()
