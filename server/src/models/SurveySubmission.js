import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    maxScore: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const surveySubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    answers: {
      type: [answerSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 105,
        message: "Exactly 105 answers are required.",
      },
    },
    totalScore: {
      type: Number,
      required: true,
    },
    averageScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const SurveySubmission = mongoose.model("SurveySubmission", surveySubmissionSchema);

export { SurveySubmission };
