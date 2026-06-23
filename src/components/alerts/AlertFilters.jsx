import { RiSearchLine } from "react-icons/ri";
import {
  ALERT_STATUSES,
  IDS_TYPES,
  SEVERITY_LEVELS,
} from "../../lib/constants";

export default function AlertFilters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <RiSearchLine
          size={16}
          className="absolute -translate-y-1/2 left-3 top-1/2 text-text-muted"
        />
        <input
          type="text"
          placeholder="Search by title..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full py-2 pr-3 text-sm border rounded-lg border-border bg-elevated pl-9 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <select
        value={filters.severity}
        onChange={(e) => update("severity", e.target.value)}
        className="px-3 py-2 text-sm border rounded-lg border-border bg-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">All Severities</option>
        {SEVERITY_LEVELS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.idsType}
        onChange={(e) => update("idsType", e.target.value)}
        className="px-3 py-2 text-sm border rounded-lg border-border bg-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">All IDS Types</option>
        {IDS_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className="px-3 py-2 text-sm border rounded-lg border-border bg-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">All Statuses</option>
        {ALERT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
