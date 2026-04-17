import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FormInput } from "../components/FormInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const validateLoginForm = ({ username, password }) => {
  const nextErrors = {};

  if (!username.trim()) {
    nextErrors.username = "Username is required.";
  }

  if (!password) {
    nextErrors.password = "Password is required.";
  }

  return nextErrors;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from || "/student/profile";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(form);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="dashboard-card-muted p-6">
        <p className="section-label">Access</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="mt-3 body-copy">Sign in to continue to the student profile, question flow, and results dashboard.</p>

        <div className="mt-6 space-y-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Protected pages</p>
            <p className="mt-2 text-sm text-slate-200">Profile, questions, results, recommendations, and PDF report</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Session</p>
            <p className="mt-2 text-sm text-slate-200">JWT is stored locally for a persistent sign-in experience</p>
          </div>
        </div>
      </div>

      <div className="app-shell p-6">
        <div className="space-y-2">
          <p className="section-label">Login</p>
          <h2 className="section-title">Sign in</h2>
          <p className="text-sm text-slate-400">Use your account credentials to access the dashboard.</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Enter username"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter password"
          />
          {submitError ? <p className="text-sm text-rose-300">{submitError}</p> : null}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          New here?{" "}
          <Link to="/register" className="font-medium text-slate-200 transition hover:text-white">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export { LoginPage };
