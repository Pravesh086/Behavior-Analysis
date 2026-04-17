import { StudentProfile, SurveySubmission } from "../models/index.js";

/**
 * Compute the Academic Score (A) from profile data.
 * Returns null if insufficient data is available.
 */
const calculateAcademicScore = (profile) => {
  if (profile.class10Percentage == null || profile.class12Percentage == null) {
    return null;
  }

  if (profile.currentSemester == null) {
    return null;
  }

  if (profile.currentSemester === 1) {
    return (profile.class10Percentage + profile.class12Percentage) / 2;
  }

  // Semester > 1: include CGPA
  if (profile.averageCgpa == null) {
    return null;
  }

  const cgpaNormalized = (profile.averageCgpa / 10) * 100;

  return (profile.class10Percentage + profile.class12Percentage + cgpaNormalized) / 3;
};

/**
 * Compute the Assessment Score (B) from survey submission.
 * B = (totalScore / totalMaxScore) * 100
 * Returns null if no submission exists.
 */
const calculateAssessmentScore = (submission) => {
  if (!submission) {
    return null;
  }

  const totalScore = submission.answers.reduce((sum, answer) => sum + answer.score, 0);
  const totalMaxScore = submission.answers.reduce((sum, answer) => sum + answer.maxScore, 0);

  if (totalMaxScore === 0) {
    return null;
  }

  return (totalScore / totalMaxScore) * 100;
};

/**
 * Compare A (academic) and B (assessment) scores.
 * Returns the comparison result with a human-readable message.
 */
const comparePerformance = (academicScore, assessmentScore) => {
  const a = Number(academicScore.toFixed(2));
  const b = Number(assessmentScore.toFixed(2));
  const difference = Number((a - b).toFixed(2));
  const absDifference = Math.abs(difference);

  let message;

  if (absDifference < 10) {
    message = "Your aptitude performance aligns with your academic performance.";
  } else if (difference >= 10) {
    message = "Your aptitude performance is lower than your academic record.";
  } else {
    message = "Your aptitude performance exceeds your academic record.";
  }

  return {
    academicScore: a,
    assessmentScore: b,
    difference,
    message,
  };
};

/**
 * Full performance analysis for a given user.
 * Returns null if data is insufficient (with a fallback message).
 */
const getPerformanceAnalysis = async (userId) => {
  const [profile, submission] = await Promise.all([
    StudentProfile.findOne({ userId }),
    SurveySubmission.findOne({ userId }),
  ]);

  if (!profile || !submission) {
    return {
      available: false,
      message: "Performance comparison requires both a completed profile and submitted survey answers.",
      academicScore: null,
      assessmentScore: null,
      difference: null,
    };
  }

  const academicScore = calculateAcademicScore(profile);
  const assessmentScore = calculateAssessmentScore(submission);

  if (academicScore == null || assessmentScore == null) {
    return {
      available: false,
      message: "Academic details (10th %, 12th %, semester, CGPA) are needed for performance comparison. Update your profile to see this analysis.",
      academicScore,
      assessmentScore,
      difference: null,
    };
  }

  const comparison = comparePerformance(academicScore, assessmentScore);

  return {
    available: true,
    ...comparison,
  };
};

export {
  calculateAcademicScore,
  calculateAssessmentScore,
  comparePerformance,
  getPerformanceAnalysis,
};
