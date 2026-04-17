import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FormInput } from "../components/FormInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const validateRegisterForm = ({ username, password, confirmPassword }) => {
  const nextErrors = {};

  if (!username.trim()) {
    nextErrors.username = "Username is required.";
  }

  if (password.length < 6) {
    nextErrors.password = "Password must be at least 6 characters.";
  }

  if (confirmPassword !== password) {
    nextErrors.confirmPassword = "Passwords do not match.";
  }

  return nextErrors;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const nextErrors = validateRegisterForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        username: form.username,
        password: form.password,
      });
      navigate("/student/profile", { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="dashboard-card-muted p-6">
        <p className="section-label">Get started</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Create your account</h1>
        <p className="mt-3 body-copy">
          Set up a secure login, complete the student profile, then move into the section-wise assessment flow.
        </p>

        <div className="mt-6 space-y-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">After signup</p>
            <p className="mt-2 text-sm text-slate-200">You will be redirected directly to the student profile form</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Security</p>
            <p className="mt-2 text-sm text-slate-200">Passwords are hashed on the backend and sessions use JWT authentication</p>
          </div>
        </div>
      </div>

      <div className="app-shell p-6">
        <div className="space-y-2">
          <p className="section-label">Register</p>
          <h2 className="section-title">Open a new workspace</h2>
          <p className="text-sm text-slate-400">Create credentials and continue into the app.</p>
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
            placeholder="Minimum 6 characters"
          />
          <FormInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Repeat password"
          />
          {submitError ? <p className="text-sm text-rose-300">{submitError}</p> : null}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-slate-200 transition hover:text-white">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export { RegisterPage };
