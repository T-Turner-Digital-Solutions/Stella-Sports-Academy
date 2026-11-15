import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** "Today, 6:14 PM" / "Yesterday, 8:27 PM" / "Nov 10, 2026" — all in the
 * org's home time zone (America/Chicago), matching other date displays. */
export function formatRelativeDayTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(d);
  const time = new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "America/Chicago" }).format(date);
  if (dayKey(date) === dayKey(now)) return `Today, ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (dayKey(date) === dayKey(yesterday)) return `Yesterday, ${time}`;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "America/Chicago" }).format(date);
}

export function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}
