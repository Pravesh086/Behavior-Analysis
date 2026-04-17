import { Link } from "react-router-dom";

import { FeatureCard } from "../components/FeatureCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="app-shell p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.26em] text-slate-300">
            Student assessment workspace
        </span>
          <div className="mt-6 max-w-3xl space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              A clean dashboard for student profiling, scoring, and guided review.
            </h1>
            <p className="body-copy max-w-2xl sm:text-base">
              Move from registration to profile capture, section-wise questions, score analysis, recommendations, and
              PDF reporting in one consistent workflow.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link
                to="/questions"
                className="btn-primary"
              >
                Continue assessment
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Create account
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="dashboard-card p-6">
          <p className="section-label">Current state</p>
          <p className="mt-3 text-2xl font-semibold text-white">{isAuthenticated ? user?.username : "Guest"}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {isAuthenticated
              ? "Your session is active. You can review your profile, complete the topic sections, or open your results dashboard."
              : "Create an account or sign in to unlock the protected student workflow."}
          </p>
          <div className="mt-6 grid gap-3">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workflow</p>
              <p className="mt-2 text-sm text-slate-200">Profile, survey, analysis, recommendations, PDF export</p>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Access</p>
              <p className="mt-2 text-sm text-slate-200">JWT-protected routes with persisted local session</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="Structured profile intake" description="Capture student details in a single clean form with validation and update support." />
        <FeatureCard title="Section-based scoring flow" description="Answer all 105 questions topic by topic without overwhelming the user with one long page." />
        <FeatureCard title="Actionable results dashboard" description="Review total score, weak areas, recommendations, and download a compact PDF report." />
      </div>
    </section>
  );
};

export { HomePage };
