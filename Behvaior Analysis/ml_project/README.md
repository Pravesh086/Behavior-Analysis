# ML Project

This folder contains the production-ready ML layer for the behavior analysis project.

## What it does

- Trains a clean tabular classifier on `resampled_data.csv`
- Prevents leakage by fitting preprocessing only on training folds
- Preserves the old notebook-trained `.h5` models for comparison
- Saves a reusable inference bundle for backend integration
- Exports evaluation metrics, feature importance, and sample predictions

## Why Random Forest

The data used by the legacy notebooks is already encoded tabular data with 18 numeric features. That is a better fit for tree ensembles than for a 1D CNN, because the feature order is not a real sequence. During clean validation, `RandomForest` outperformed the other tested algorithms and gave the best held-out test performance.

## Project Layout

- `src/ml_pipeline.py`: core training and inference logic
- `src/config.py`: project paths and training settings
- `scripts/train.py`: train, compare, and export artifacts
- `scripts/predict.py`: run inference from JSON or CSV
- `artifacts/`: trained model bundle and reports
- `examples/sample_input.json`: example request payload for backend work

## Training

From the repository root:

```powershell
python ml_project\scripts\train.py
```

Outputs are written to `ml_project\artifacts\`.

## Prediction

Single JSON record:

```powershell
python ml_project\scripts\predict.py --input-json ml_project\examples\sample_input.json
```

Batch CSV:

```powershell
python ml_project\scripts\predict.py --input-csv path\\to\\rows.csv --output-csv predictions.csv
```

## Backend Integration Contract

Input payload must contain these 18 features:

- `Logical quotient rating`
- `hackathons`
- `coding skills rating`
- `public speaking points`
- `self-learning capability?`
- `Extra-courses did`
- `certifications`
- `workshops`
- `reading and writing skills`
- `memory capability score`
- `Interested subjects`
- `interested career area `
- `Type of company want to settle in?`
- `Taken inputs from seniors or elders`
- `Management or Technical`
- `hard/smart worker`
- `worked in teams ever?`
- `Introvert`

Output includes:

- `predicted_label`
- `predicted_class_id`
- `confidence`
- `class_probabilities`

## Notes

- `R2` is not used because this is multiclass classification, not regression.
- Legacy CNN scores are read from notebook outputs and preserved for comparison.
- The old `.h5` files are intentionally not modified.
