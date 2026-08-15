import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { newsPosts } from "@/content/news";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "News & Updates",
  description: `Athlete achievements, program announcements, and updates from ${site.name}.`,
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Stay Updated"
        title="News & Updates"
        description="Athlete achievements, program announcements, partnerships, and more from Steller Sports Academy."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          {newsPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-6 transition-shadow hover:shadow-lg"
                >
                  <Badge tone="red">{post.category}</Badge>
                  <h2 className="font-display text-lg uppercase tracking-wide text-ink">{post.title}</h2>
                  <p className="text-sm text-ink/60">{post.excerpt}</p>
                  <p className="mt-auto text-xs text-ink/40">{formatDate(post.date)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Newspaper}
              title="No News Posted Yet"
              description="Program announcements and athlete achievements will appear here as Steller shares them."
            />
          )}
        </Container>
      </section>
    </>
  );
}
