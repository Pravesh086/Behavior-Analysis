from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ml_project.src.ml_pipeline import predict_records


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run inference with the trained ML bundle.")
    parser.add_argument("--input-json", type=Path, help="Path to a JSON file containing one record or a list of records.")
    parser.add_argument("--input-csv", type=Path, help="Path to a CSV file containing batch records.")
    parser.add_argument("--output-csv", type=Path, help="Optional output CSV for batch predictions.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if bool(args.input_json) == bool(args.input_csv):
        raise SystemExit("Provide exactly one of --input-json or --input-csv.")

    if args.input_json:
        payload = json.loads(args.input_json.read_text(encoding="utf-8"))
        records = payload if isinstance(payload, list) else [payload]
        predictions = predict_records(records)
        print(json.dumps(predictions, indent=2))
        return

    frame = pd.read_csv(args.input_csv)
    records = frame.to_dict(orient="records")
    predictions = predict_records(records)
    output = frame.copy()
    for key in ["predicted_class_id", "predicted_label", "confidence"]:
        output[key] = [row.get(key) for row in predictions]
    if args.output_csv:
        output.to_csv(args.output_csv, index=False)
    else:
        print(output.to_json(orient="records", indent=2))


if __name__ == "__main__":
    main()
