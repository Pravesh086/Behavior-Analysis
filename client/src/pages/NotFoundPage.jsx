import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">404</p>
    <h1 className="text-4xl font-semibold text-white">Page not found</h1>
    <p className="max-w-md text-slate-300">The route exists in the app shell, but there is no page mapped here yet.</p>
    <Link
      to="/"
      className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
    >
      Back to home
    </Link>
  </section>
);

export { NotFoundPage };
