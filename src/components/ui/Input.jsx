import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, type = "text", className = "", ...props },
  ref,
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full rounded-lg border bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error ? "border-red" : "border-border"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red">{error}</span>}
    </label>
  );
});

export default Input;
