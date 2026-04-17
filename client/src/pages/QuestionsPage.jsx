import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { getQuestionsRequest, submitScoresRequest } from "../services/api.js";

const ratingValues = [1, 2, 3, 4, 5];

const buildCompletionMap = (topics, scores) =>
  topics.map((topic) => ({
    title: topic.title,
    answered: topic.questions.filter((question) => scores[String(question.id)]).length,
    total: topic.questions.length,
  }));

const findFirstIncompleteTopicIndex = (topics, scores) =>
  topics.findIndex((topic) => topic.questions.some((question) => !scores[String(question.id)]));

const QuestionsPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [scores, setScores] = useState({});
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await getQuestionsRequest(token);
        setTopics(data.topics || []);
        setScores(data.existingScores || {});
        setSubmittedAt(data.submittedAt || "");
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [token]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTopicIndex]);

  const completion = useMemo(() => buildCompletionMap(topics, scores), [topics, scores]);
  const totalQuestions = useMemo(
    () => topics.reduce((sum, topic) => sum + topic.questions.length, 0),
    [topics],
  );
  const answeredCount = useMemo(
    () => Object.values(scores).filter((value) => Number.isInteger(Number(value))).length,
    [scores],
  );

  const currentTopic = topics[currentTopicIndex];
  const isLastTopic = currentTopicIndex === topics.length - 1;

  const handleScoreChange = (questionId, value) => {
    setScores((current) => ({
      ...current,
      [String(questionId)]: value,
    }));
    setSubmitError("");
  };

  const goToTopic = (index) => {
    setCurrentTopicIndex(index);
  };

  const handleSubmit = async () => {
    if (answeredCount !== totalQuestions) {
      const firstIncompleteIndex = findFirstIncompleteTopicIndex(topics, scores);
      if (firstIncompleteIndex >= 0) {
        setCurrentTopicIndex(firstIncompleteIndex);
      }
      setSubmitError("Answer all 105 questions before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      const result = await submitScoresRequest(token, { scores });
      setSubmittedAt(result.submittedAt);
      navigate("/results", { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <section className="app-shell p-6 text-slate-300">Loading questions...</section>;
  }

  if (loadError) {
    return <section className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">{loadError}</section>;
  }

  if (!currentTopic) {
    return <section className="app-shell p-6 text-slate-300">No questions available.</section>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
      <aside className="space-y-4">
        <div className="dashboard-card-muted p-5">
          <p className="section-label">Survey progress</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">105 questions</h1>
          <p className="mt-3 body-copy">
            Questions are grouped by topic so you can move through the survey in sections instead of seeing everything at once.
          </p>
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Answered</span>
              <span>
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${totalQuestions ? (answeredCount / totalQuestions) * 100 : 0}%` }}
              />
            </div>
          </div>
          {submittedAt ? <p className="mt-4 text-xs text-emerald-300">Last saved: {new Date(submittedAt).toLocaleString()}</p> : null}
        </div>

        <div className="dashboard-card p-4">
          <div className="space-y-2">
            {completion.map((topic, index) => {
              const isActive = index === currentTopicIndex;
              const isComplete = topic.answered === topic.total;

              return (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() => goToTopic(index)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                      isActive
                        ? "border-blue-400/40 bg-blue-500/10 shadow-soft"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                >
                  <span className="pr-3 text-sm font-medium text-slate-200">{topic.title}</span>
                  <span className={`text-xs ${isComplete ? "text-emerald-300" : "text-slate-500"}`}>
                    {topic.answered}/{topic.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="app-shell p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Current topic</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{currentTopic.title}</h2>
          </div>
          <p className="text-sm text-slate-400">
            Section {currentTopicIndex + 1} of {topics.length}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {currentTopic.questions.map((question) => (
            <article
              key={question.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-soft transition duration-200 hover:border-white/20 hover:bg-white/[0.035]"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="max-w-2xl text-sm leading-7 text-slate-100">{question.text}</p>
                <div className="flex flex-wrap gap-2">
                  {ratingValues.map((value) => {
                    const isSelected = Number(scores[String(question.id)]) === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleScoreChange(question.id, value)}
                        className={`min-w-11 rounded-xl border px-3 py-2 text-sm font-medium transition duration-200 ${
                          isSelected
                            ? "border-blue-400/50 bg-blue-500/12 text-blue-100"
                            : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        {submitError ? <p className="mt-5 text-sm text-rose-300">{submitError}</p> : null}

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goToTopic(Math.max(currentTopicIndex - 1, 0))}
              disabled={currentTopicIndex === 0}
              className="btn-secondary"
            >
              Previous
            </button>
            {!isLastTopic ? (
              <button
                type="button"
                onClick={() => goToTopic(Math.min(currentTopicIndex + 1, topics.length - 1))}
                className="btn-primary"
              >
                Next topic
              </button>
            ) : null}
          </div>

          {isLastTopic ? (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Submitting..." : "Submit scores"}
            </button>
          ) : (
            <p className="text-sm text-slate-500">Move topic by topic until the final section to submit.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export { QuestionsPage };
