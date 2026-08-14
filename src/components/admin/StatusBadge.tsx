import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "@/lib/submissions";

const styles: Record<SubmissionStatus, string> = {
  new: "bg-red-100 text-red-700",
  reviewed: "bg-paper-dim text-ink/70",
  archived: "bg-ink/5 text-ink/40",
};

const labels: Record<SubmissionStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
