import { useEffect, useState } from "react";

import { PerformanceCharts } from "../components/PerformanceCharts.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { analyzeScoresRequest, downloadReportRequest, getRecommendationsRequest } from "../services/api.js";

const ResultsPage = () => {
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [expandedArea, setExpandedArea] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      try {
        const [analysisResult, recommendationResult] = await Promise.all([
          analyzeScoresRequest(token),
          getRecommendationsRequest(token),
        ]);

        setAnalysis(analysisResult);
        setRecommendations(recommendationResult);
        setExpandedArea(recommendationResult[0]?.area || "");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [token]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadReportRequest(token);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "student-report.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <section className="app-shell p-6 text-slate-300">Loading results...</section>;
  }

  if (error) {
    return <section className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">{error}</section>;
  }

  if (!analysis) {
    return (
      <section className="app-shell p-6 text-slate-300">
        Submit all 105 survey answers first, then return here to view analysis and recommendations.
      </section>
    );
  }

  const perf = analysis.performance_analysis;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
        <div className="app-shell p-6">
          <p className="section-label">Results</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Survey summary</h1>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn-secondary"
            >
              {isDownloading ? "Preparing PDF..." : "Download PDF"}
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{analysis.totalScore}</p>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dataset max</p>
              <p className="mt-2 text-3xl font-semibold text-white">{analysis.totalMaxScore}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6">
          <p className="section-label">Weak areas</p>
          {analysis.weakAreas.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {analysis.weakAreas.map((area) => (
                <div
                  key={area.area}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-soft transition duration-200 hover:border-white/20"
                >
                  <p className="text-sm font-medium text-white">{area.area}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {area.score}/{area.maxScore}
                  </p>
                  <p className="mt-1 text-xs text-rose-300">{area.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-emerald-300">No weak areas detected. Current scores are acceptable or strong across all areas.</p>
          )}
        </div>
      </div>

      {/* Performance Comparison Message */}
      {perf ? (
        <div className={`rounded-3xl border p-5 shadow-soft transition duration-200 ${
          perf.available
            ? "border-blue-400/20 bg-blue-500/[0.06]"
            : "border-white/10 bg-white/[0.03]"
        }`}>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.379 2.624l-1.06 1.06a7 7 0 0011.94-3.36l-.318.148a5.5 5.5 0 01-1.183-.472zm-4.9-7.895a7 7 0 00-8.468 8.468l.318-.148a5.5 5.5 0 019.379-2.624l1.06-1.06a7 7 0 00-2.289-4.636z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Performance Analysis</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{perf.message}</p>
              {perf.available ? (
                <div className="mt-3 flex gap-6">
                  <p className="text-xs text-slate-400">
                    Academic: <span className="font-semibold text-blue-300">{perf.academicScore}%</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Assessment: <span className="font-semibold text-violet-300">{perf.assessmentScore}%</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Difference: <span className="font-semibold text-slate-200">{perf.difference > 0 ? "+" : ""}{perf.difference}%</span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Charts */}
      <PerformanceCharts analysis={analysis} />

      <div className="dashboard-card p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Area-wise breakdown</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Topic scores</h2>
          </div>
          <p className="text-sm text-slate-500">All calculations are produced by the backend.</p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {analysis.areaScores.map((area) => (
            <div
              key={area.area}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-soft transition duration-200 hover:border-white/20"
            >
              <p className="text-sm font-medium text-white">{area.area}</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">
                {area.score}/{area.maxScore}
              </p>
              <p className="mt-1 text-xs text-slate-500">{area.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card-muted p-6">
        <div>
          <p className="section-label">Recommendations</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Targeted guidance</h2>
        </div>

        {recommendations.length ? (
          <div className="mt-5 space-y-3">
            {recommendations.map((item) => {
              const isExpanded = expandedArea === item.area;

              return (
                <article
                  key={item.area}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 shadow-soft transition duration-200 hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedArea(isExpanded ? "" : item.area)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.02]"
                  >
                    <div>
                      <p className="text-base font-medium text-white">{item.area}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.issueLevel}</p>
                    </div>
                    <span className="text-xs text-slate-300">{isExpanded ? "Hide" : "View"}</span>
                  </button>

                  {isExpanded ? (
                    <div className="border-t border-white/10 px-5 py-4">
                      <div className="space-y-3">
                        {item.recommendations.map((recommendation, index) => (
                          <div
                            key={`${item.area}-${index + 1}`}
                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                          >
                            <p className="text-sm leading-7 text-slate-200">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 text-sm text-emerald-300">No recommendations needed right now.</p>
        )}
      </div>
    </section>
  );
};

export { ResultsPage };
