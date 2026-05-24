import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchTests } from "@/lib/testApi";
import { buildCategories } from "@/lib/categories";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Timer,
  ShieldCheck,
  BarChart3,
  Brain,
  Maximize,
  GraduationCap,
} from "lucide-react";
import logoVx from "@/assets/logo-vx.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VidyaX by EduSpark — Smart Test Series for JEE, NEET & GATE" },
      {
        name: "description",
        content:
          "Practice with exam-grade mock tests for Class 10, 11/12 JEE, NEET and GATE. Full-screen test mode, instant scoring, real exam feel.",
      },
      { property: "og:title", content: "VidyaX by EduSpark — Smart Test Series" },
      { property: "og:description", content: "Exam-grade mocks for JEE, NEET, GATE & school exams." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: tests, isLoading } = useQuery({ queryKey: ["tests"], queryFn: fetchTests });
  const categories = buildCategories(tests ?? []);
  const totalTests = tests?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-ink/10 bg-gradient-hero">
        <div className="absolute inset-0 dot-bg opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-6 sm:pt-20 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div style={{ animation: "fade-up 0.5s both" }}>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-soft">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                VidyaX · an EduSpark initiative
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Crack <span className="text-primary">JEE, NEET, boards</span> &amp; other competitive exams with exam-grade mocks.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Pick your class, pick your stream, attempt full-screen tests that feel like the real exam. Instant scoring. No distractions.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-bold text-background shadow-soft transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Choose your category
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-card px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-foreground"
                >
                  How it works
                </a>
              </div>

              <div className="mt-10 flex max-w-md flex-wrap gap-x-8 gap-y-4 text-left">
                {[
                  { k: isLoading ? "…" : String(totalTests || 0), v: totalTests === 1 ? "Active test" : "Active tests" },
                  { k: isLoading ? "…" : String(categories.length || 0), v: categories.length === 1 ? "Category" : "Categories" },
                  { k: "Free", v: "No signup needed" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="font-display text-3xl font-bold text-foreground tabular-nums">{s.k}</div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand panel */}
            <div className="relative" style={{ animation: "fade-up 0.6s 0.1s both" }}>
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-foreground p-8 text-background shadow-elevated">
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="relative flex items-center gap-4">
                  <img src={logoVx} alt="VidyaX" className="h-16 w-16 rounded-2xl ring-2 ring-background/30" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-background/60">
                      The platform
                    </div>
                    <div className="font-display text-2xl font-bold">
                      Vidya<span className="text-primary-glow">X</span>
                    </div>
                    <div className="text-xs font-semibold text-background/70">an EduSpark initiative</div>
                  </div>
                </div>
                <div className="relative mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: Maximize, label: "Full-screen exam mode" },
                    { icon: Timer, label: "Live countdown timer" },
                    { icon: BarChart3, label: "Instant score breakdown" },
                    { icon: ShieldCheck, label: "No signup needed" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-2 rounded-xl border border-background/15 bg-background/5 p-3">
                      <f.icon className="h-4 w-4 text-primary-glow" />
                      <span className="text-xs font-semibold">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section intentionally removed — users browse via the
          "Choose your category" CTA / Navbar link. */}

      {/* FEATURES */}
      <section id="features" className="border-y-2 border-ink/10 bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Why VidyaX
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Built like the actual exam.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every detail — from full-screen mode to the palette — keeps you focused.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: Maximize, title: "Full-screen mode", desc: "Tests auto-launch in distraction-free full-screen." },
              { icon: Timer, title: "Live timer", desc: "Persistent countdown with auto-submit when time ends." },
              { icon: Brain, title: "Smart navigation", desc: "Big Prev/Next buttons + palette drawer to jump anywhere." },
              { icon: BarChart3, title: "Instant scoring", desc: "Attempt summary, subject-wise breakdown right after." },
              { icon: CheckCircle2, title: "Mark for review", desc: "Flag tricky questions and revisit before submitting." },
              { icon: ShieldCheck, title: "Zero signup", desc: "Pick a test and start. No account, no friction." },
            ].map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl border-2 border-ink/10 bg-card p-6 transition-all hover:-translate-y-1 hover:border-foreground"
                style={{ animation: `fade-up 0.45s ${i * 40}ms both` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-gradient-to-br from-primary via-primary-glow to-foreground p-8 text-background shadow-elevated sm:p-14">
          <div className="absolute inset-0 grid-bg opacity-20" />
          {/* Splash animations */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/70 blur-3xl"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-[-3rem] h-60 w-60 rounded-full bg-background/30 blur-3xl"
            style={{ animation: "float 5s ease-in-out infinite" }}
          />
          <div
            className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/40 blur-2xl"
            style={{ animation: "pulse-glow 2.2s ease-in-out infinite", animationDelay: "0.6s" }}
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-background/80">
                VidyaX · by EduSpark
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Ready for your next mock?
              </h3>
              <p className="mt-2 max-w-xl text-sm text-background/90">
                Pick a category, attempt in full-screen, and see your score the moment you submit.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-bold text-foreground shadow-soft transition-transform hover:scale-[1.03] active:scale-95"
            >
              Browse categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 pb-20 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">FAQ</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Questions, answered</h2>
        </div>
        <div className="mt-8 space-y-3">
          {[
            { q: "Do I need to sign up to attempt a test?", a: "No. Pick a category, open any test, and start instantly." },
            { q: "Does the test run in full-screen?", a: "Yes. The moment you tap Start Test, VidyaX goes full-screen for a distraction-free exam feel." },
            { q: "Can I navigate between questions freely?", a: "Yes. Use the big Previous / Next buttons or open the palette drawer to jump anywhere." },
            { q: "What happens when time runs out?", a: "The test auto-submits with whatever answers you've marked and takes you straight to the result." },
          ].map((item, i) => (
            <details
              key={item.q}
              className="group rounded-2xl border-2 border-ink/10 bg-card p-5 transition-colors open:border-foreground"
              style={{ animation: `fade-up 0.4s ${i * 50}ms both` }}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-bold text-foreground">
                {item.q}
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink/15 text-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}