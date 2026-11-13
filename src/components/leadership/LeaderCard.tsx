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
    <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white px-6 py-6 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
          {initials(leader.name)}
        </div>
        <div className="flex-1">
          <p className="font-display text-lg uppercase tracking-wide text-ink">{leader.name}</p>
          <p
            className="mt-1.5 inline-block rounded-md bg-red-700 px-3 py-1 text-xs font-bold italic uppercase tracking-wide text-white"
            style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)" }}
          >
            {leader.roleLabel}
          </p>
        </div>
      </div>
      {leader.bio && <p className="text-sm leading-relaxed text-ink/60">{leader.bio}</p>}
    </div>
  );
}
