"""
answer_pipeline.py
==================
Drop-in replacement for the original predict_records() call.

Pipeline
--------
  User question / feature dict
        ↓
  [Step 1] ML classifier  →  predicted class label
        ↓
  [Step 2] answer_mapping.get_answer()  →  predefined answer string
        ↓
  Output dict  (no probabilities, no scores in the final response)

Key design decisions
--------------------
* The model is used ONLY as a classifier (no text generation).
* Outputs are 100% deterministic.
* Unknown classes are handled via a safe fallback.
* This module is a thin wrapper — it does not retrain or modify the model.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

from ml_project.src.answer_mapping import FALLBACK_ANSWER, get_answer, is_known_class
from ml_project.src.config import TRAINED_BUNDLE_PATH
from ml_project.src.ml_pipeline import load_bundle


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def answer_for_record(
    record: dict[str, Any],
    bundle_path: Path = TRAINED_BUNDLE_PATH,
) -> dict[str, Any]:
    """
    Run the full pipeline for a **single** feature record.

    Parameters
    ----------
    record:
        A dict of {feature_name: value} matching the 18 features the model
        was trained on.  See ml_project/examples/sample_input.json for the
        expected schema.
    bundle_path:
        Optional path to the serialised model bundle (defaults to the
        standard artifact location).

    Returns
    -------
    dict with keys:
        - predicted_class  : str  — the label the classifier chose
        - answer           : str  — the predefined human-readable answer
        - is_known_class   : bool — whether the class was in the mapping
    """
    return answer_for_records([record], bundle_path=bundle_path)[0]


def answer_for_records(
    records: list[dict[str, Any]],
    bundle_path: Path = TRAINED_BUNDLE_PATH,
) -> list[dict[str, Any]]:
    """
    Run the full pipeline for a **batch** of feature records.

    Parameters
    ----------
    records:
        List of feature dicts.
    bundle_path:
        Optional path to the serialised model bundle.

    Returns
    -------
    List of dicts, one per record, each with:
        - predicted_class  : str
        - answer           : str
        - is_known_class   : bool
    """
    bundle = load_bundle(bundle_path)
    feature_columns: list[str] = bundle["feature_columns"]
    class_names: list[str] = bundle["class_names"]
    pipeline = bundle["pipeline"]

    frame = pd.DataFrame(records)
    missing = [c for c in feature_columns if c not in frame.columns]
    if missing:
        raise ValueError(
            f"Missing required input features: {missing}\n"
            f"Expected features: {feature_columns}"
        )

    frame = frame[feature_columns]

    # Step 1 — classifier predicts integer class ids
    predicted_ids = pipeline.predict(frame)

    # Step 2 — map integer id → class name → predefined answer
    results: list[dict[str, Any]] = []
    for pred_id in predicted_ids:
        class_label: str = class_names[int(pred_id)]
        answer: str = get_answer(class_label)
        results.append(
            {
                "predicted_class": class_label,
                "answer": answer,
                "is_known_class": is_known_class(class_label),
            }
        )

    return results


# ---------------------------------------------------------------------------
# Convenience: answer from a raw question string (keyword-matching stub)
# ---------------------------------------------------------------------------
# NOTE: This stub does NOT perform NLP-based intent recognition.
# The user's question is passed through, but the ANSWER is determined
# entirely by the ML classifier operating on structured feature inputs,
# not on the question text.  Update this wrapper once you have a
# feature-extraction layer that converts free text → feature dict.

def answer_for_question(
    question: str,
    feature_record: dict[str, Any],
    bundle_path: Path = TRAINED_BUNDLE_PATH,
) -> dict[str, Any]:
    """
    Convenience wrapper that accepts both a user question (logged for
    traceability) and the structured feature record required by the model.

    The answer is determined solely by the ML classifier + predefined map.

    Returns
    -------
    dict with keys:
        - question         : str — the original user question (echoed back)
        - predicted_class  : str
        - answer           : str
        - is_known_class   : bool
    """
    result = answer_for_record(feature_record, bundle_path=bundle_path)
    return {"question": question, **result}
