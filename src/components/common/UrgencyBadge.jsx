import { getUrgencyLevel, getUrgencyLabel } from "../../ai/urgencyScorer";

export default function UrgencyBadge({ score }) {
  const level = getUrgencyLevel(score);

  const styles = {
    high: "bg-red-100 text-red-700 border border-red-200",
    medium: "bg-amber-100 text-amber-700 border border-amber-200",
    low: "bg-green-100 text-green-700 border border-green-200",
  };

  const dotStyles = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
  };

  return (
    <span className={`badge ${styles[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[level]} animate-pulse-soft`} />
      <span className="ml-1">{score}/10</span>
    </span>
  );
}
