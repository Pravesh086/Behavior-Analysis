const FeatureCard = ({ title, description }) => (
  <article className="dashboard-card-muted p-5 hover:border-white/20 hover:bg-white/[0.04]">
    <h3 className="text-base font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
  </article>
);

export { FeatureCard };
