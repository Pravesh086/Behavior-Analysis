"""
answer.py  –  CLI entry-point for the answer-mapped prediction pipeline.

Usage
-----
Single JSON record:
    python ml_project/scripts/answer.py --input-json ml_project/examples/sample_input.json

Batch CSV:
    python ml_project/scripts/answer.py --input-csv path/to/rows.csv --output-csv out.csv

Question + JSON record (question is echoed back, answer is still classifier-driven):
    python ml_project/scripts/answer.py \\
        --question "What career suits me?" \\
        --input-json ml_project/examples/sample_input.json
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ml_project.src.answer_pipeline import (
    answer_for_question,
    answer_for_records,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Answer-mapped prediction pipeline. "
        "Returns predefined answers instead of probability scores."
    )
    parser.add_argument(
        "--input-json",
        type=Path,
        help="Path to a JSON file containing one feature record or a list of records.",
    )
    parser.add_argument(
        "--input-csv",
        type=Path,
        help="Path to a CSV file containing batch feature records.",
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        help="Optional output CSV path for batch predictions.",
    )
    parser.add_argument(
        "--question",
        type=str,
        default=None,
        help="Optional user question (echoed back in the response; does NOT affect the answer).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if bool(args.input_json) == bool(args.input_csv):
        raise SystemExit("Provide exactly one of --input-json or --input-csv.")

    # ------------------------------------------------------------------ JSON
    if args.input_json:
        payload = json.loads(args.input_json.read_text(encoding="utf-8"))
        records = payload if isinstance(payload, list) else [payload]

        if args.question and len(records) == 1:
            result = answer_for_question(
                question=args.question,
                feature_record=records[0],
            )
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            results = answer_for_records(records)
            print(json.dumps(results, indent=2, ensure_ascii=False))
        return

    # ------------------------------------------------------------------ CSV
    frame = pd.read_csv(args.input_csv)
    records = frame.to_dict(orient="records")
    results = answer_for_records(records)

    output = frame.copy()
    output["predicted_class"] = [r["predicted_class"] for r in results]
    output["answer"] = [r["answer"] for r in results]
    output["is_known_class"] = [r["is_known_class"] for r in results]

    if args.output_csv:
        output.to_csv(args.output_csv, index=False)
        print(f"Saved {len(output)} predictions to {args.output_csv}")
    else:
        print(output[["predicted_class", "answer"]].to_string(index=False))


if __name__ == "__main__":
    main()
