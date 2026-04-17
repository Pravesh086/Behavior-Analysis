import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { AppError } from "./http.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionExplorerPath = path.resolve(__dirname, "../../../Behvaior Analysis/ml_project/question_explorer.html");
const datasetPath = path.resolve(__dirname, "../../../synthetic_student_data.csv");

let cachedQuestionBank = null;

const parseCsvHeaderAndObservedMaxScores = (input) => {
  let header = null;
  let observedMaxScores = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };

  const finalizeRow = () => {
    if (row.length === 0 || (row.length === 1 && row[0] === "")) {
      row = [];
      return;
    }

    if (!header) {
      header = [...row];
      observedMaxScores = new Array(Math.max(header.length - 1, 0)).fill(0);
      row = [];
      return;
    }

    const scoreColumnCount = Math.min(observedMaxScores.length, Math.max(row.length - 1, 0));
    for (let index = 0; index < scoreColumnCount; index += 1) {
      const numericValue = Number(row[index]);
      if (Number.isFinite(numericValue)) {
        observedMaxScores[index] = Math.max(observedMaxScores[index], numericValue);
      }
    }

    row = [];
  };

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (character === "\"") {
      if (inQuotes && input[index + 1] === "\"") {
        field += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (character === "," && !inQuotes) {
      pushField();
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && input[index + 1] === "\n") {
        index += 1;
      }
      pushField();
      finalizeRow();
      continue;
    }

    field += character;
  }

  if (field !== "" || row.length > 0) {
    pushField();
    finalizeRow();
  }

  return {
    header,
    observedMaxScores,
  };
};

const extractMaxScore = (field) => {
  const match = field.trim().match(/(?:-|\?)(\d+(?:\.\d+)?)$/);

  if (!match) {
    throw new AppError(`Unable to extract max score from question header: ${field}`, 500);
  }

  return Number(match[1]);
};

const loadQuestionBank = () => {
  if (cachedQuestionBank) {
    return cachedQuestionBank;
  }

  const html = fs.readFileSync(questionExplorerPath, "utf8");
  const htmlMatches = [...html.matchAll(/\{ n: (\d+), cat: "([^"]+)", q: "([\s\S]*?)", a: "([\s\S]*?)" \}/g)];

  if (htmlMatches.length !== 105) {
    throw new AppError(`Expected 105 questions in question explorer, found ${htmlMatches.length}.`, 500);
  }

  const csvText = fs.readFileSync(datasetPath, "utf8");
  const { header: headerFields, observedMaxScores } = parseCsvHeaderAndObservedMaxScores(csvText);

  if (!headerFields?.length) {
    throw new AppError("Could not parse header from synthetic_student_data.csv.", 500);
  }

  const questionHeaders = headerFields.slice(0, -1);

  if (questionHeaders.length !== 105) {
    throw new AppError(`Expected 105 question headers in dataset, found ${questionHeaders.length}.`, 500);
  }

  const questions = htmlMatches.map((match, index) => ({
    id: Number(match[1]),
    topic: match[2],
    text: match[3],
    guidance: match[4],
    maxScore: Number.isFinite(observedMaxScores[index]) && observedMaxScores[index] > 0
      ? observedMaxScores[index]
      : extractMaxScore(questionHeaders[index]),
  }));

  const topics = [];
  for (const question of questions) {
    const currentTopic = topics[topics.length - 1];

    if (!currentTopic || currentTopic.title !== question.topic) {
      topics.push({
        id: topics.length + 1,
        title: question.topic,
        questions: [],
      });
    }

    topics[topics.length - 1].questions.push(question);
  }

  cachedQuestionBank = {
    totalQuestions: questions.length,
    totalTopics: topics.length,
    questions,
    topics,
  };

  return cachedQuestionBank;
};

export { loadQuestionBank };
