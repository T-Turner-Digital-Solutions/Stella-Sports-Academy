import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/15";

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label} {required && <span className="text-red-700">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink/50">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClasses, className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(inputClasses, "min-h-[120px] resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(inputClasses, "appearance-none bg-white", className)} {...props}>
      {children}
    </select>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  ...props
}: { id: string; label: React.ReactNode; error?: string } & Omit<
  ComponentProps<"input">,
  "type" | "id"
>) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-4 w-4 flex-shrink-0 rounded border-ink/30 text-red-700 focus:ring-red-700/30"
          {...props}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink/75">
          {label}
        </label>
      </div>
      {error && (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckboxGroup({
  legend,
  options,
  name,
  selected,
  onToggle,
  error,
}: {
  legend: string;
  options: readonly string[];
  name: string;
  selected: string[];
  onToggle: (value: string) => void;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold text-ink">{legend}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const id = `${name}-${option.replace(/\s+/g, "-").toLowerCase()}`;
          return (
            <label
              key={option}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm text-ink/80 transition-colors has-checked:border-red-700 has-checked:bg-red-100 has-checked:text-red-700"
            >
              <input
                id={id}
                type="checkbox"
                className="h-4 w-4 rounded border-ink/30 text-red-700 focus:ring-red-700/30"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
              />
              {option}
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="website">Leave this field blank</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
