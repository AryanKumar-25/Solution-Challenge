import UrgencyBadge from "./UrgencyBadge";
import { MapPin, Tag, Clock } from "lucide-react";

const categoryIcons = {
  food: "🍲",
  medical: "🏥",
  shelter: "🏠",
  education: "📚",
};

const statusStyles = {
  open: "bg-blue-100 text-blue-700",
  assigned: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
};

export default function NeedCard({ need, onClick, actions }) {
  return (
    <div
      className="need-card cursor-pointer group"
      onClick={() => onClick?.(need)}
      id={`need-card-${need.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryIcons[need.category] || "📋"}</span>
          <span className="text-sm font-semibold text-gray-700 capitalize">
            {need.category}
          </span>
        </div>
        <UrgencyBadge score={need.urgencyScore} />
      </div>

      {/* Description */}
      <p className="text-gray-800 text-sm leading-relaxed mb-3 line-clamp-3">
        {need.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {need.locationName || "Unknown location"}
        </span>
        <span className={`badge ${statusStyles[need.status] || "bg-gray-100 text-gray-600"}`}>
          {need.status}
        </span>
        {need.createdAt && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {need.createdAt.toDate
              ? need.createdAt.toDate().toLocaleDateString()
              : "Recent"}
          </span>
        )}
      </div>

      {/* Actions */}
      {actions && <div className="flex gap-2 pt-2 border-t border-gray-50">{actions}</div>}
    </div>
  );
}
