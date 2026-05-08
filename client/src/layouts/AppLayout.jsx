import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const linkClassName = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition duration-200 ${
    isActive ? "bg-white/[0.06] text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
  }`;

const AppLayout = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid bg-[size:28px_28px] opacity-25" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-white/[0.03] to-transparent" />

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white">
              SP
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight text-white">Student Portal</span>
              <span className="block text-xs text-slate-500">Assessment dashboard</span>
            </span>
          </NavLink>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <nav className="flex flex-wrap items-center gap-1.5">
              <NavLink to="/" className={linkClassName}>
                Home
              </NavLink>
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" ? (
                    <NavLink to="/admin" className={linkClassName}>
                      Admin
                    </NavLink>
                  ) : (
                    <>
                      <NavLink to="/questions" className={linkClassName}>
                        Questions
                      </NavLink>
                      <NavLink to="/results" className={linkClassName}>
                        Results
                      </NavLink>
                      <NavLink to="/student/profile" className={linkClassName}>
                        Profile
                      </NavLink>
                    </>
                  )}
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClassName}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn-secondary px-3.5 py-2">
                    Register
                  </NavLink>
                </>
              )}
            </nav>

            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-slate-500">Authenticated session</p>
                </div>
                <button type="button" onClick={logout} className="btn-secondary px-3 py-2">
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export { AppLayout };
