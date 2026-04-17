import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    stream: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    fatherJob: {
      type: String,
      required: true,
      trim: true,
    },
    fatherIncome: {
      type: Number,
      min: 0,
      default: null,
    },
    class10Percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    class12Percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    currentSemester: {
      type: Number,
      min: 1,
      default: null,
    },
    averageCgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export { StudentProfile };
