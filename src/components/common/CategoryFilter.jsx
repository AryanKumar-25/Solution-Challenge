import { Filter } from "lucide-react";

const categories = [
  { value: "", label: "All Categories" },
  { value: "food", label: "🍱 Food" },
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
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#6B7280" }}>
        <Filter size={16} />
        <span style={{ fontWeight: 500 }} className="hidden sm:inline">Filter:</span>
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            style={{
              padding: "6px 16px", borderRadius: 999, cursor: "pointer",
              border: "1.5px solid transparent",
              background: selectedCategory === cat.value ? "#6B4EFF" : "white",
              color: selectedCategory === cat.value ? "white" : "#6B7280",
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13,
              transition: "all 0.2s ease",
              boxShadow: selectedCategory === cat.value ? "0 4px 12px rgba(107,78,255,0.25)" : "none",
              borderColor: selectedCategory === cat.value ? "#6B4EFF" : "#E5E7EB",
            }}
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
          id="status-filter"
          style={{
            padding: "8px 14px", borderRadius: 12,
            border: "1.5px solid #E5E7EB", background: "white",
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
            color: "#1A1A2E", cursor: "pointer", outline: "none",
          }}
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
