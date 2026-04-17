import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FormInput } from "../components/FormInput.jsx";
import { FormSelect } from "../components/FormSelect.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getStudentProfileRequest, saveStudentProfileRequest } from "../services/api.js";

const initialForm = {
  name: "",
  age: "",
  collegeName: "",
  courseName: "",
  stream: "",
  rollNumber: "",
  gender: "",
  fatherJob: "",
  fatherIncome: "",
  class10Percentage: "",
  class12Percentage: "",
  currentSemester: "",
  averageCgpa: "",
};

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const validateProfileForm = (form, { isNewProfile }) => {
  const nextErrors = {};

  for (const [key, value] of Object.entries(form)) {
    if (key === "fatherIncome" || key === "class10Percentage" || key === "class12Percentage" || key === "currentSemester" || key === "averageCgpa") {
      continue;
    }

    if (!String(value).trim()) {
      nextErrors[key] = "This field is required.";
    }
  }

  if (form.age && Number(form.age) <= 0) {
    nextErrors.age = "Age must be greater than 0.";
  }

  if (form.age && Number(form.age) > 120) {
    nextErrors.age = "Age must be 120 or less.";
  }

  if (form.fatherIncome && Number(form.fatherIncome) < 0) {
    nextErrors.fatherIncome = "Income cannot be negative.";
  }

  // Academic fields: required for new profiles
  if (isNewProfile) {
    if (!String(form.class10Percentage).trim()) {
      nextErrors.class10Percentage = "This field is required for new profiles.";
    }
    if (!String(form.class12Percentage).trim()) {
      nextErrors.class12Percentage = "This field is required for new profiles.";
    }
    if (!String(form.currentSemester).trim()) {
      nextErrors.currentSemester = "This field is required for new profiles.";
    }
    if (!String(form.averageCgpa).trim()) {
      nextErrors.averageCgpa = "This field is required for new profiles.";
    }
  }

  // Range validation when values are provided
  const pct10 = form.class10Percentage !== "" ? Number(form.class10Percentage) : null;
  if (pct10 !== null && (pct10 < 0 || pct10 > 100)) {
    nextErrors.class10Percentage = "Must be between 0 and 100.";
  }

  const pct12 = form.class12Percentage !== "" ? Number(form.class12Percentage) : null;
  if (pct12 !== null && (pct12 < 0 || pct12 > 100)) {
    nextErrors.class12Percentage = "Must be between 0 and 100.";
  }

  const sem = form.currentSemester !== "" ? Number(form.currentSemester) : null;
  if (sem !== null && (!Number.isInteger(sem) || sem < 1)) {
    nextErrors.currentSemester = "Must be an integer ≥ 1.";
  }

  const cgpa = form.averageCgpa !== "" ? Number(form.averageCgpa) : null;
  if (cgpa !== null && (cgpa < 0 || cgpa > 10)) {
    nextErrors.averageCgpa = "Must be between 0 and 10.";
  }

  return nextErrors;
};

const buildSubmittedForm = (formElement) => {
  const formData = new FormData(formElement);

  return {
    name: String(formData.get("name") || "").trim(),
    age: String(formData.get("age") || "").trim(),
    collegeName: String(formData.get("collegeName") || "").trim(),
    courseName: String(formData.get("courseName") || "").trim(),
    stream: String(formData.get("stream") || "").trim(),
    rollNumber: String(formData.get("rollNumber") || "").trim(),
    gender: String(formData.get("gender") || "").trim(),
    fatherJob: String(formData.get("fatherJob") || "").trim(),
    fatherIncome: String(formData.get("fatherIncome") || "").trim(),
    class10Percentage: String(formData.get("class10Percentage") || "").trim(),
    class12Percentage: String(formData.get("class12Percentage") || "").trim(),
    currentSemester: String(formData.get("currentSemester") || "").trim(),
    averageCgpa: String(formData.get("averageCgpa") || "").trim(),
  };
};

const StudentProfilePage = () => {
  const { token } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getStudentProfileRequest(token);
        if (!profile) {
          return;
        }

        setIsNewProfile(false);
        setForm({
          name: profile.name || "",
          age: profile.age?.toString() || "",
          collegeName: profile.collegeName || "",
          courseName: profile.courseName || "",
          stream: profile.stream || "",
          rollNumber: profile.rollNumber || "",
          gender: profile.gender || "",
          fatherJob: profile.fatherJob || "",
          fatherIncome: profile.fatherIncome?.toString() || "",
          class10Percentage: profile.class10Percentage?.toString() || "",
          class12Percentage: profile.class12Percentage?.toString() || "",
          currentSemester: profile.currentSemester?.toString() || "",
          averageCgpa: profile.averageCgpa?.toString() || "",
        });
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token]);

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
    setStatusMessage("");
    setLoadError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submittedForm = buildSubmittedForm(event.currentTarget);
    const nextErrors = validateProfileForm(submittedForm, { isNewProfile });

    if (Object.keys(nextErrors).length > 0) {
      setForm(submittedForm);
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setForm(submittedForm);
      await saveStudentProfileRequest(token, submittedForm);
      setStatusMessage("Student profile saved.");
      setIsNewProfile(false);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="dashboard-card-muted p-6">
        <p className="section-label">Student account</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Profile details</h1>
        <p className="mt-3 body-copy">
          Each authenticated user maintains one student profile. Saving again updates the same record.
        </p>
        <div className="mt-6 space-y-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Profile use</p>
            <p className="mt-2 text-sm text-slate-200">Included in analysis context, recommendations, and PDF reports</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Access model</p>
            <p className="mt-2 text-sm text-slate-200">Protected with JWT authentication and persistent local session storage</p>
          </div>
        </div>
      </div>

      <div className="app-shell p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-label">Form</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{isLoading ? "Loading..." : "Student details"}</h2>
          </div>
          {statusMessage ? <p className="text-sm text-emerald-300">{statusMessage}</p> : null}
        </div>

        {loadError ? <p className="mt-4 text-sm text-rose-300">{loadError}</p> : null}

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} autoComplete="off">
          <FormInput label="Name" name="name" value={form.name} onChange={handleChange} onInput={handleChange} error={errors.name} />
          <FormInput label="Age" name="age" type="number" value={form.age} onChange={handleChange} onInput={handleChange} error={errors.age} />
          <FormInput
            label="College name"
            name="collegeName"
            value={form.collegeName}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.collegeName}
          />
          <FormInput
            label="Course name"
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.courseName}
          />
          <FormInput label="Stream" name="stream" value={form.stream} onChange={handleChange} onInput={handleChange} error={errors.stream} />
          <FormInput
            label="Roll number"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.rollNumber}
          />
          <FormSelect
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.gender}
            options={genderOptions}
          />
          <FormInput
            label="Father job"
            name="fatherJob"
            value={form.fatherJob}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.fatherJob}
          />
          <FormInput
            label="Father income"
            name="fatherIncome"
            type="number"
            value={form.fatherIncome}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.fatherIncome}
          />

          {/* Academic Details */}
          <div className="sm:col-span-2 mt-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-blue-400 mb-1">Academic Details{isNewProfile ? " (required)" : " (optional)"}</p>
            <div className="h-px bg-white/10" />
          </div>
          <FormInput
            label="Class 10th percentage"
            name="class10Percentage"
            type="number"
            value={form.class10Percentage}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.class10Percentage}
          />
          <FormInput
            label="Class 12th percentage"
            name="class12Percentage"
            type="number"
            value={form.class12Percentage}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.class12Percentage}
          />
          <FormInput
            label="Current semester"
            name="currentSemester"
            type="number"
            value={form.currentSemester}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.currentSemester}
          />
          <FormInput
            label="Average CGPA (out of 10)"
            name="averageCgpa"
            type="number"
            value={form.averageCgpa}
            onChange={handleChange}
            onInput={handleChange}
            error={errors.averageCgpa}
          />

          <div className="sm:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={isSubmitting || isLoading} className="btn-primary flex-1">
                {isSubmitting ? "Saving..." : "Save profile"}
              </button>
              <Link to="/questions" className="btn-secondary flex-1">
                Go to questions
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export { StudentProfilePage };
