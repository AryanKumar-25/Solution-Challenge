import { Filter } from "lucide-react";

const categories = [
  { value: "", label: "All Categories" },
  { value: "food", label: "🍲 Food" },
  { value: "medical", label: "🏥 Medical" },
  { value: "shelter", label: "🏠 Shelter" },
  { value: "education", label: "📚 Education" },
];

const statuses = [
  { value: "", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "assigned", label: "Assigned" },
  { value: "resolved", label: "Resolved" },
];

export default function CategoryFilter({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Filter className="w-4 h-4" />
        <span className="font-medium hidden sm:inline">Filter:</span>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`category-chip ${
              selectedCategory === cat.value ? "selected" : ""
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      {onStatusChange && (
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input-field !w-auto !py-1.5 !px-3 text-sm"
          id="status-filter"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
