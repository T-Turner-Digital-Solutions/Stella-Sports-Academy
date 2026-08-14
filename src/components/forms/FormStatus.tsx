import { CheckCircle2, AlertCircle } from "lucide-react";
import type { SubmitState } from "@/lib/forms-client";

export function FormStatus({ state }: { state: SubmitState }) {
  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-paper-dim px-4 py-3.5 text-sm text-ink" role="status">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <p>{state.message}</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-red-100 px-4 py-3.5 text-sm text-red-800" role="alert">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <p>{state.message}</p>
      </div>
    );
  }

  return null;
}
