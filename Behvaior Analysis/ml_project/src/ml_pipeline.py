from __future__ import annotations

import json
import re
from dataclasses import dataclass
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

from ml_project.src.config import (
    ARTIFACTS_DIR,
    FEATURE_IMPORTANCE_PATH,
    LEGACY_NOTEBOOKS,
    MODEL_REPORT_PATH,
    ORIGINAL_DATA_PATH,
    RANDOM_STATE,
    RESAMPLED_DATA_PATH,
    SAMPLE_INPUT_PATH,
    SAMPLE_PREDICTIONS_PATH,
    TARGET_COL,
    TRAINED_BUNDLE_PATH,
)


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


def ensure_dirs() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    SAMPLE_INPUT_PATH.parent.mkdir(parents=True, exist_ok=True)


def load_training_dataframe() -> pd.DataFrame:
    df = pd.read_csv(RESAMPLED_DATA_PATH)
    return df.drop_duplicates().reset_index(drop=True)


def resolve_class_names() -> list[str]:
    if ORIGINAL_DATA_PATH.exists():
        source_labels = pd.read_csv(ORIGINAL_DATA_PATH)[TARGET_COL].astype(str)
        encoder = LabelEncoder()
        encoder.fit(source_labels)
        return encoder.classes_.tolist()

    training_labels = pd.read_csv(RESAMPLED_DATA_PATH)[TARGET_COL].astype(str)
    encoder = LabelEncoder()
    encoder.fit(training_labels)
    return encoder.classes_.tolist()


def make_splits(df: pd.DataFrame) -> SplitBundle:
    x = df.drop(columns=[TARGET_COL])
    y_raw = df[TARGET_COL].astype(str)

    label_encoder = LabelEncoder()
    label_encoder.fit([str(i) for i in range(len(resolve_class_names()))])
    y = label_encoder.transform(y_raw)

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
        class_names=resolve_class_names(),
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
            random_state=RANDOM_STATE,
            n_jobs=1,
            class_weight="balanced_subsample",
        ),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=900,
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


def compute_metrics(model: Pipeline, x: pd.DataFrame, y: np.ndarray, class_names: list[str]) -> dict[str, Any]:
    y_pred = model.predict(x)
    metrics: dict[str, Any] = {
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


def benchmark_models(split_bundle: SplitBundle) -> tuple[list[dict[str, Any]], str]:
    results: list[dict[str, Any]] = []
    candidate_models = build_candidate_models(len(split_bundle.class_names))

    for model_name, estimator in candidate_models.items():
        pipeline = build_pipeline(
            build_preprocessor(split_bundle.numeric_cols, split_bundle.categorical_cols),
            estimator,
        )
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
    best_pipeline = build_pipeline(
        build_preprocessor(split_bundle.numeric_cols, split_bundle.categorical_cols),
        candidate_models[best_model_name],
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
    }
    for notebook_path in LEGACY_NOTEBOOKS:
        if not notebook_path.exists():
            continue
        text = notebook_path.read_text(encoding="utf-8")
        for key, pattern in patterns.items():
            if key in legacy:
                continue
            match = pattern.search(text)
            if match:
                legacy[key] = float(match.group(1)) if match.groups() else {
                    "hybrid_accuracy": 0.93,
                    "legacy_xgboost_accuracy": 0.909583,
                    "legacy_random_forest_accuracy": 0.995833,
                }[key]
    return legacy


def export_feature_importance(bundle: dict[str, Any]) -> None:
    pipeline: Pipeline = bundle["pipeline"]
    feature_names = pipeline.named_steps["preprocessor"].get_feature_names_out()
    model = pipeline.named_steps["model"]
    if not hasattr(model, "feature_importances_"):
        return
    importance_df = pd.DataFrame(
        {
            "feature": feature_names,
            "importance": model.feature_importances_,
        }
    ).sort_values("importance", ascending=False)
    importance_df.to_csv(FEATURE_IMPORTANCE_PATH, index=False)


def export_sample_input(df: pd.DataFrame) -> None:
    sample_record = df.drop(columns=[TARGET_COL]).iloc[0].to_dict()
    SAMPLE_INPUT_PATH.write_text(json.dumps(sample_record, indent=2), encoding="utf-8")


def export_sample_predictions(split_bundle: SplitBundle, pipeline: Pipeline, class_names: list[str]) -> None:
    sample = split_bundle.x_test.head(20).copy()
    pred_ids = pipeline.predict(sample)
    sample["predicted_class_id"] = pred_ids
    sample["predicted_label"] = [class_names[int(idx)] for idx in pred_ids]
    sample["true_label"] = [class_names[int(idx)] for idx in split_bundle.y_test[:20]]
    sample.to_csv(SAMPLE_PREDICTIONS_PATH, index=False)


def train_and_export() -> dict[str, Any]:
    ensure_dirs()
    source_df = load_training_dataframe()
    split_bundle = make_splits(source_df)
    benchmark_results, best_model_name = benchmark_models(split_bundle)
    best_pipeline, test_metrics = train_best_model(split_bundle, best_model_name)
    legacy_scores = extract_legacy_scores()

    model_bundle = {
        "pipeline": best_pipeline,
        "class_names": split_bundle.class_names,
        "feature_columns": split_bundle.x_train.columns.tolist(),
        "target_column": TARGET_COL,
        "selected_model": best_model_name,
    }
    joblib.dump(model_bundle, TRAINED_BUNDLE_PATH, compress=3)

    export_sample_predictions(split_bundle, best_pipeline, split_bundle.class_names)
    export_sample_input(source_df)
    export_feature_importance(model_bundle)

    report = {
        "dataset": {
            "source_file": str(RESAMPLED_DATA_PATH.name),
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
            "used stratified train validation test split",
            "fit preprocessing only inside the pipeline to prevent leakage",
            "selected a tabular algorithm instead of forcing a CNN onto non-sequential features",
            "benchmarked multiple algorithms and selected the winner by validation macro F1",
            "saved a reusable inference bundle with feature columns and class names",
        ],
        "algorithm_choice": {
            "selected_model": best_model_name,
            "selection_reason": (
                "Random Forest was selected because it achieved the strongest validation macro F1 on the "
                "encoded tabular dataset and is robust on low-dimensional structured features."
                if best_model_name == "random_forest"
                else "This model achieved the strongest validation macro F1 on the encoded tabular dataset."
            ),
        },
        "benchmark_results": benchmark_results,
        "final_test_metrics": test_metrics,
        "legacy_scores": legacy_scores,
        "comparison": {
            "legacy_cnn_accuracy": legacy_scores.get("cnn_test_accuracy"),
            "fresh_model_accuracy": test_metrics["accuracy"],
            "accuracy_delta_vs_legacy_cnn": None
            if legacy_scores.get("cnn_test_accuracy") is None
            else float(test_metrics["accuracy"] - legacy_scores["cnn_test_accuracy"]),
        },
        "artifacts": {
            "bundle": str(TRAINED_BUNDLE_PATH),
            "report": str(MODEL_REPORT_PATH),
            "feature_importance": str(FEATURE_IMPORTANCE_PATH),
            "sample_predictions": str(SAMPLE_PREDICTIONS_PATH),
            "sample_input": str(SAMPLE_INPUT_PATH),
        },
    }
    MODEL_REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def load_bundle(bundle_path: Path = TRAINED_BUNDLE_PATH) -> dict[str, Any]:
    return joblib.load(bundle_path)


def predict_records(records: list[dict[str, Any]], bundle_path: Path = TRAINED_BUNDLE_PATH) -> list[dict[str, Any]]:
    bundle = load_bundle(bundle_path)
    feature_columns: list[str] = bundle["feature_columns"]
    class_names: list[str] = bundle["class_names"]
    pipeline: Pipeline = bundle["pipeline"]

    frame = pd.DataFrame(records)
    missing = [col for col in feature_columns if col not in frame.columns]
    if missing:
        raise ValueError(f"Missing required features: {missing}")

    frame = frame[feature_columns]
    predicted_ids = pipeline.predict(frame)
    probabilities = pipeline.predict_proba(frame) if hasattr(pipeline, "predict_proba") else None

    outputs: list[dict[str, Any]] = []
    for idx, pred_id in enumerate(predicted_ids):
        row: dict[str, Any] = {
            "predicted_class_id": int(pred_id),
            "predicted_label": class_names[int(pred_id)],
        }
        if probabilities is not None:
            row["confidence"] = float(np.max(probabilities[idx]))
            row["class_probabilities"] = {
                class_names[class_idx]: float(prob)
                for class_idx, prob in enumerate(probabilities[idx])
            }
        outputs.append(row)
    return outputs
