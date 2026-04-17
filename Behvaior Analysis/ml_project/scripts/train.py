from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ml_project.src.ml_pipeline import train_and_export


def main() -> None:
    report = train_and_export()
    print(json.dumps(
        {
            "selected_model": report["algorithm_choice"]["selected_model"],
            "accuracy": report["final_test_metrics"]["accuracy"],
            "macro_f1": report["final_test_metrics"]["macro_f1"],
            "balanced_accuracy": report["final_test_metrics"]["balanced_accuracy"],
            "legacy_cnn_accuracy": report["legacy_scores"].get("cnn_test_accuracy"),
            "accuracy_delta_vs_legacy_cnn": report["comparison"]["accuracy_delta_vs_legacy_cnn"],
        },
        indent=2,
    ))


if __name__ == "__main__":
    main()
