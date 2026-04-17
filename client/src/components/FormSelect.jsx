const FormSelect = ({ label, error, options, className = "", onChange, onInput, ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">{label}</span>
    <select {...props} onChange={onChange} onInput={onInput || onChange} className="input-control">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error ? <span className="mt-1.5 block text-xs text-rose-300">{error}</span> : null}
  </label>
);

export { FormSelect };
