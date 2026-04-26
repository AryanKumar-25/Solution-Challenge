import UrgencyBadge from "./UrgencyBadge";
import { MapPin, Navigation, CheckCircle, XCircle } from "lucide-react";

const categoryIcons = {
  food: "🍲",
  medical: "🏥",
  shelter: "🏠",
  education: "📚",
};

export default function TaskCard({
  need,
  distance,
  matchScore,
  taskStatus,
  onAccept,
  onDecline,
  onComplete,
  onClick,
}) {
  return (
    <div
      className="need-card cursor-pointer"
      onClick={() => onClick?.(need)}
      id={`task-card-${need?.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryIcons[need?.category] || "📋"}</span>
          <span className="text-sm font-semibold text-gray-700 capitalize">
            {need?.category}
          </span>
        </div>
        <UrgencyBadge score={need?.urgencyScore || 5} />
      </div>

      {/* Description */}
      <p className="text-gray-800 text-sm leading-relaxed mb-3 line-clamp-2">
        {need?.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {need?.locationName || "Unknown"}
        </span>
        {distance !== undefined && (
          <span className="flex items-center gap-1 text-accent font-semibold">
            <Navigation className="w-3.5 h-3.5" />
            {distance} km away
          </span>
        )}
        {matchScore !== undefined && (
          <span className="badge bg-primary-50 text-primary border border-primary-100">
            Match: {matchScore}%
          </span>
        )}
      </div>

      {/* Task Status */}
      {taskStatus && (
        <div className="mb-3">
          <span
            className={`badge ${
              taskStatus === "accepted"
                ? "bg-blue-100 text-blue-700"
                : taskStatus === "done"
                ? "bg-green-100 text-green-700"
                : taskStatus === "declined"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {taskStatus}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-50">
        {onAccept && (
          <button
            className="btn-success text-xs px-4 py-2 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onAccept();
            }}
          >
            <CheckCircle className="w-4 h-4" />
            Accept
          </button>
        )}
        {onDecline && (
          <button
            className="btn-ghost text-xs px-4 py-2 flex-1 border border-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              onDecline();
            }}
          >
            <XCircle className="w-4 h-4" />
            Decline
          </button>
        )}
        {onComplete && (
          <button
            className="btn-accent text-xs px-4 py-2 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
          >
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
