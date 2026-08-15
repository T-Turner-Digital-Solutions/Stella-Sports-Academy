import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { formatDate } from "@/lib/utils";
import type { SubmissionStatus, SubmissionType } from "@/lib/submissions";

export function SubmissionCard({
  title,
  status,
  createdAt,
  type,
  id,
  fields,
}: {
  title: string;
  status: SubmissionStatus;
  createdAt: string;
  type: SubmissionType;
  id: string;
  fields: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg uppercase tracking-wide text-ink">{title}</h3>
          <p className="mt-1 text-xs text-ink/45">Submitted {formatDate(createdAt)}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/40">{field.label}</p>
            <p className="mt-1 text-sm text-ink/80">{field.value || "—"}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-ink/10 pt-5">
        <StatusToggle type={type} id={id} status={status} />
      </div>
    </div>
  );
}
