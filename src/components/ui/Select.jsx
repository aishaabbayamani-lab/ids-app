import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, options, placeholder, className = "", ...props },
  ref,
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
        </span>
      )}
      <select
        ref={ref}
        defaultValue=""
        className={`w-full rounded-lg border bg-elevated px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error ? "border-red" : "border-border"
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-red">{error}</span>}
    </label>
  );
});

export default Select;
