import type { Leader } from "@/content/leadership";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink/10 bg-white px-6 py-8 text-center shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-maroon-700 to-maroon-900 text-2xl font-bold text-gold-300">
        {initials(leader.name)}
      </div>
      <div>
        <p className="font-display text-lg uppercase tracking-wide text-ink">{leader.name}</p>
        <p className="mt-1 text-sm font-semibold text-maroon-700">{leader.roleLabel}</p>
      </div>
      {leader.bio && <p className="text-sm leading-relaxed text-ink/60">{leader.bio}</p>}
    </div>
  );
}
