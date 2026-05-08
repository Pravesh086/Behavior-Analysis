import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";
import {
  deleteAdminSubmissionRequest,
  getAdminLeaderboardRequest,
  getAdminStatsRequest,
  getAdminStudentDetailsRequest,
  getAdminStudentsRequest,
  updateAdminUserBlockRequest,
} from "../services/api.js";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    performance: "",
    minScore: "",
    maxScore: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(
    () => ({
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    }),
    [filters, pagination.page, pagination.limit],
  );

  const loadDashboard = async () => {
    try {
      setError("");
      const [studentsResult, statsResult, leaderboardResult] = await Promise.all([
        getAdminStudentsRequest(token, query),
        getAdminStatsRequest(token),
        getAdminLeaderboardRequest(token, { limit: 10 }),
      ]);

      setStudents(studentsResult.students || []);
      setPagination(studentsResult.pagination || pagination);
      setStats(statsResult);
      setLeaderboard(leaderboardResult || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, query]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  };

  const handleViewDetails = async (userId) => {
    try {
      setIsDetailLoading(true);
      setError("");
      const data = await getAdminStudentDetailsRequest(token, userId);
      setSelectedStudent(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    const confirmed = window.confirm("Delete this submission? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminSubmissionRequest(token, submissionId);
      setSelectedStudent(null);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleBlockToggle = async (student) => {
    try {
      await updateAdminUserBlockRequest(token, student.id, !student.isBlocked);
      await loadDashboard();
      if (selectedStudent?.student?.id === student.id) {
        const data = await getAdminStudentDetailsRequest(token, student.id);
        setSelectedStudent(data);
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (isLoading) {
    return <section className="app-shell p-6 text-slate-300">Loading admin dashboard...</section>;
  }

  return (
    <section className="space-y-6">
      {error ? <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}

      <div className="app-shell p-6">
        <p className="section-label">Admin</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Student overview</h1>
            <p className="mt-2 text-sm text-slate-400">Review users, submissions, scores, rankings, and account status.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="stat-card">
            <p className="section-label">Users</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats?.totalUsers || 0}</p>
          </div>
          <div className="stat-card">
            <p className="section-label">Submissions</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats?.totalSubmissions || 0}</p>
          </div>
          <div className="stat-card">
            <p className="section-label">Average</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats?.averageScore || 0}</p>
          </div>
          <div className="stat-card">
            <p className="section-label">Highest</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats?.highestScore || 0}</p>
          </div>
          <div className="stat-card">
            <p className="section-label">Lowest</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats?.lowestScore || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
        <div className="dashboard-card p-5">
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="input-control md:col-span-2"
              placeholder="Search name, email, score"
            />
            <select name="status" value={filters.status} onChange={handleFilterChange} className="input-control">
              <option value="">All status</option>
              <option value="submitted">Submitted</option>
              <option value="not-submitted">Not submitted</option>
            </select>
            <select name="performance" value={filters.performance} onChange={handleFilterChange} className="input-control">
              <option value="">All performance</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="needs-attention">Needs attention</option>
            </select>
            <input
              name="minScore"
              type="number"
              min="0"
              value={filters.minScore}
              onChange={handleFilterChange}
              className="input-control"
              placeholder="Min score"
            />
            <input
              name="maxScore"
              type="number"
              min="0"
              value={filters.maxScore}
              onChange={handleFilterChange}
              className="input-control"
              placeholder="Max score"
            />
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="input-control">
              <option value="createdAt">Newest users</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="score">Score</option>
              <option value="submittedAt">Submitted at</option>
            </select>
            <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange} className="input-control">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Student</th>
                  <th className="py-3 pr-4 font-medium">Score</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Submitted</th>
                  <th className="py-3 pr-4 font-medium">Account</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="py-4 pr-4">
                      <p className="font-medium text-white">{student.profile?.name || "-"}</p>
                      <p className="text-xs text-slate-500">{student.username}</p>
                    </td>
                    <td className="py-4 pr-4 text-slate-200">{student.submission?.totalScore ?? "-"}</td>
                    <td className="py-4 pr-4 text-slate-300">{student.submissionStatus}</td>
                    <td className="py-4 pr-4 text-slate-400">{formatDate(student.submission?.updatedAt)}</td>
                    <td className="py-4 pr-4">
                      <span className={student.isBlocked ? "text-rose-300" : "text-emerald-300"}>
                        {student.isBlocked ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleViewDetails(student.id)} className="btn-secondary px-3 py-2">
                          View
                        </button>
                        <button type="button" onClick={() => handleBlockToggle(student)} className="btn-secondary px-3 py-2">
                          {student.isBlocked ? "Restore" : "Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
            <span>
              Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} students)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary px-3 py-2"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn-secondary px-3 py-2"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <aside className="dashboard-card-muted p-5">
          <p className="section-label">Leaderboard</p>
          <div className="mt-4 space-y-3">
            {leaderboard.map((student) => (
              <div key={student.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      #{student.rank} {student.profile?.name || student.username}
                    </p>
                    <p className="text-xs text-slate-500">{student.username}</p>
                  </div>
                  <p className="text-lg font-semibold text-white">{student.submission?.totalScore}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {selectedStudent ? (
        <div className="dashboard-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-label">Submission detail</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {selectedStudent.student.profile?.name || selectedStudent.student.username}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{selectedStudent.student.username}</p>
            </div>
            <button type="button" onClick={() => setSelectedStudent(null)} className="btn-secondary">
              Close
            </button>
          </div>

          {isDetailLoading ? <p className="mt-4 text-sm text-slate-400">Loading details...</p> : null}

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="stat-card">
              <p className="section-label">Score</p>
              <p className="mt-2 text-2xl font-semibold text-white">{selectedStudent.student.submission?.totalScore ?? "-"}</p>
            </div>
            <div className="stat-card">
              <p className="section-label">Average</p>
              <p className="mt-2 text-2xl font-semibold text-white">{selectedStudent.student.submission?.averageScore ?? "-"}</p>
            </div>
            <div className="stat-card">
              <p className="section-label">Submitted</p>
              <p className="mt-2 text-sm text-white">{formatDate(selectedStudent.student.submission?.updatedAt)}</p>
            </div>
          </div>

          {selectedStudent.submissionHistory[0] ? (
            <>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  className="btn-secondary border-rose-400/30 text-rose-200 hover:border-rose-300/50"
                  onClick={() => handleDeleteSubmission(selectedStudent.submissionHistory[0].id)}
                >
                  Delete submission
                </button>
              </div>
              <div className="mt-4 max-h-[420px] overflow-y-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="p-3 font-medium">Question</th>
                      <th className="p-3 font-medium">Topic</th>
                      <th className="p-3 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {selectedStudent.submissionHistory[0].answers.map((answer) => (
                      <tr key={answer.questionId}>
                        <td className="p-3 text-slate-200">{answer.question}</td>
                        <td className="p-3 text-slate-400">{answer.topic}</td>
                        <td className="p-3 text-slate-200">
                          {answer.score}/{answer.maxScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="mt-5 text-sm text-slate-400">No submission found for this student.</p>
          )}
        </div>
      ) : null}
    </section>
  );
};

export { AdminDashboardPage };
