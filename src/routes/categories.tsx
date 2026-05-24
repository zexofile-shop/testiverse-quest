import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchTests } from "@/lib/testApi";
import { buildCategories } from "@/lib/categories";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, ChevronLeft } from "lucide-react";
import logoVx from "@/assets/logo-vx.jpg";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — VidyaX by EduSpark" },
      {
        name: "description",
        content: "Browse all test categories — JEE, NEET, GATE, Class 10 boards & more.",
      },
      { property: "og:title", content: "All Categories — VidyaX" },
      { property: "og:description", content: "Pick a stream to see its mock tests." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: tests, isLoading } = useQuery({ queryKey: ["tests"], queryFn: fetchTests });
  const categories = useMemo(() => buildCategories(tests ?? []), [tests]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-ink/10 bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="mt-3 text-sm font-semibold text-primary">All categories</div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            What are you preparing for?
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Tap a category to see every test inside it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border-2 border-ink/10 bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Link
                key={c.stream}
                to="/category/$stream"
                params={{ stream: encodeURIComponent(c.stream) }}
                className="group relative flex flex-col rounded-2xl border-2 border-ink/10 bg-card p-3.5 transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-elevated sm:p-5"
                style={{ animation: `fade-up 0.45s ${i * 30}ms both` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl ring-2 ring-ink shadow-soft sm:h-12 sm:w-12">
                    <img src={logoVx} alt="VidyaX" className="h-full w-full object-cover" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background tabular-nums">
                    {c.count}
                  </span>
                </div>
                <div className="mt-3 font-display text-sm font-bold leading-tight text-foreground sm:text-lg">
                  {c.label}
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-sm">
                  {c.tagline}
                </p>
                <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-ink/10 pt-2.5 sm:mt-4 sm:pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    {c.count === 1 ? "1 test" : `${c.count} tests`}
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink/10 text-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary sm:h-9 sm:w-9">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
