const FormInput = ({ label, error, className = "", onChange, onInput, autoComplete = "off", ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">{label}</span>
    <input {...props} autoComplete={autoComplete} onChange={onChange} onInput={onInput || onChange} className="input-control" />
    {error ? <span className="mt-1.5 block text-xs text-rose-300">{error}</span> : null}
  </label>
);

export { FormInput };
