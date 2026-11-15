import { AlertTriangle } from "lucide-react";

/** Shown instead of silently rendering an empty list when a feature's
 * underlying table/column hasn't been created yet — distinguishes "nothing
 * here" (fine) from "we can't check yet" (needs a pending database
 * update), per the explicit requirement not to treat a missing table as
 * proof that there's no data. */
export function MigrationPendingNotice({ feature }: { feature: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p>
        <strong>{feature} isn&apos;t available yet.</strong> This board hasn&apos;t had a required database update
        applied. Nothing has been lost — existing records will appear as soon as it&apos;s applied.
      </p>
    </div>
  );
}
