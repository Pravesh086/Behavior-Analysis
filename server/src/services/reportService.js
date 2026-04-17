import PDFDocument from "pdfkit";

import { SurveySubmission } from "../models/index.js";
import { AppError } from "../utils/http.js";
import { loadQuestionBank } from "../utils/questionBank.js";
import { analyzeSavedSubmission } from "./analysisService.js";
import { getPerformanceAnalysis } from "./performanceService.js";
import { getRecommendationsForUser } from "./recommendationService.js";
import { getStudentProfileByUserId } from "./studentService.js";

const addSectionTitle = (document, title) => {
  document.moveDown();
  document.font("Helvetica-Bold").fontSize(14).text(title);
  document.moveDown(0.4);
  document.font("Helvetica").fontSize(10);
};

const writeKeyValueRows = (document, rows) => {
  rows.forEach(([label, value]) => {
    document.font("Helvetica-Bold").text(`${label}: `, { continued: true });
    document.font("Helvetica").text(String(value ?? "-"));
  });
};

const addPageIfNeeded = (document, threshold = 720) => {
  if (document.y > threshold) {
    document.addPage();
  }
};

const createPdfBuffer = (writer) =>
  new Promise((resolve, reject) => {
    const document = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    const chunks = [];
    document.on("data", (chunk) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    writer(document);
    document.end();
  });

const buildReportBuffer = async (userId) => {
  const [profile, analysis, recommendations, submission, performanceAnalysis] = await Promise.all([
    getStudentProfileByUserId(userId),
    analyzeSavedSubmission(userId),
    getRecommendationsForUser(userId),
    SurveySubmission.findOne({ userId }),
    getPerformanceAnalysis(userId),
  ]);

  if (!submission) {
    throw new AppError("No submitted scores found for report generation.", 404);
  }

  const questionBank = loadQuestionBank();
  const answerMap = new Map(submission.answers.map((answer) => [answer.questionId, answer]));

  return createPdfBuffer((document) => {
    document.info.Title = "Student Behavior Report";
    document.font("Helvetica-Bold").fontSize(18).text("Student Behavior Report");
    document.moveDown(0.5);
    document.font("Helvetica").fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`);

    addSectionTitle(document, "Student Details");
    writeKeyValueRows(document, [
      ["Name", profile.name],
      ["Age", profile.age],
      ["College Name", profile.collegeName],
      ["Course Name", profile.courseName],
      ["Stream", profile.stream],
      ["Roll Number", profile.rollNumber],
      ["Gender", profile.gender],
      ["Father Job", profile.fatherJob],
      ["Father Income", profile.fatherIncome ?? "-"],
      ["Class 10th %", profile.class10Percentage ?? "-"],
      ["Class 12th %", profile.class12Percentage ?? "-"],
      ["Current Semester", profile.currentSemester ?? "-"],
      ["Average CGPA", profile.averageCgpa ?? "-"],
    ]);

    addSectionTitle(document, "Performance Comparison");
    if (performanceAnalysis?.available) {
      writeKeyValueRows(document, [
        ["Academic Score (A)", `${performanceAnalysis.academicScore}%`],
        ["Assessment Score (B)", `${performanceAnalysis.assessmentScore}%`],
        ["Difference", performanceAnalysis.difference],
        ["Verdict", performanceAnalysis.message],
      ]);
    } else {
      document.text(performanceAnalysis?.message || "Insufficient data for performance comparison.");
    }

    addSectionTitle(document, "Score Summary");
    writeKeyValueRows(document, [
      ["Total Score", `${analysis.totalScore} / ${analysis.totalMaxScore}`],
      ["Weak Areas", analysis.weakAreas.length ? analysis.weakAreas.map((area) => area.area).join(", ") : "None"],
    ]);

    addSectionTitle(document, "Area-wise Comparison");
    analysis.areaScores.forEach((area) => {
      addPageIfNeeded(document);
      document.font("Helvetica-Bold").text(area.area);
      document.font("Helvetica").text(`Score: ${area.score} / ${area.maxScore}`);
      document.text(`Status: ${area.status}`);
      document.moveDown(0.5);
    });

    addSectionTitle(document, "Recommendations");
    if (recommendations.length === 0) {
      document.text("No recommendations needed right now.");
    } else {
      recommendations.forEach((item) => {
        addPageIfNeeded(document);
        document.font("Helvetica-Bold").text(`${item.area} (${item.issueLevel})`);
        document.font("Helvetica");
        item.recommendations.forEach((recommendation, index) => {
          document.text(`${index + 1}. ${recommendation}`);
          document.moveDown(0.25);
        });
        document.moveDown(0.5);
      });
    }

    addSectionTitle(document, "All 105 Scores");
    questionBank.topics.forEach((topic) => {
      addPageIfNeeded(document, 700);
      document.font("Helvetica-Bold").text(topic.title);
      document.moveDown(0.3);
      topic.questions.forEach((question) => {
        addPageIfNeeded(document, 740);
        const answer = answerMap.get(question.id);
        const scoreText = answer ? `${answer.score} / ${question.maxScore}` : `- / ${question.maxScore}`;
        document.font("Helvetica").text(question.text);
        document.text(`Score: ${scoreText}`);
        document.moveDown(0.35);
      });
      document.moveDown(0.4);
    });
  });
};

export { buildReportBuffer };
