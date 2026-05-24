import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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
      {
        property: "og:description",
        content: "Exam-grade mocks for JEE, NEET, GATE & school exams.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: tests, isLoading } = useQuery({ queryKey: ["tests"], queryFn: fetchTests });
  const categories = useMemo(() => buildCategories(tests ?? []), [tests]);
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
                Crack <span className="text-primary">JEE, NEET, boards</span> &amp; other
                competitive exams with exam-grade mocks.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Pick your class, pick your stream, attempt full-screen tests that feel like the real
                exam. Instant scoring. No distractions.
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
                  {
                    k: isLoading ? "…" : String(totalTests || 0),
                    v: totalTests === 1 ? "Active test" : "Active tests",
                  },
                  {
                    k: isLoading ? "…" : String(categories.length || 0),
                    v: categories.length === 1 ? "Category" : "Categories",
                  },
                  { k: "Free", v: "No signup needed" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="font-display text-3xl font-bold text-foreground tabular-nums">
                      {s.k}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.v}
                    </div>
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
                  <img
                    src={logoVx}
                    alt="VidyaX"
                    className="h-16 w-16 rounded-2xl ring-2 ring-background/30"
                  />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-background/60">
                      The platform
                    </div>
                    <div className="font-display text-2xl font-bold">
                      Vidya<span className="text-primary-glow">X</span>
                    </div>
                    <div className="text-xs font-semibold text-background/70">
                      an EduSpark initiative
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: Maximize, label: "Full-screen exam mode" },
                    { icon: Timer, label: "Live countdown timer" },
                    { icon: BarChart3, label: "Instant score breakdown" },
                    { icon: ShieldCheck, label: "No signup needed" },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-2 rounded-xl border border-background/15 bg-background/5 p-3"
                    >
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

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {[
              {
                icon: Maximize,
                title: "Full-screen mode",
                desc: "Distraction-free, real exam feel.",
              },
              { icon: Timer, title: "Live timer", desc: "Countdown with auto-submit." },
              { icon: Brain, title: "Smart navigation", desc: "Prev/Next + palette drawer." },
              { icon: BarChart3, title: "Instant scoring", desc: "Subject-wise breakdown." },
              { icon: CheckCircle2, title: "Mark for review", desc: "Flag and revisit later." },
              { icon: ShieldCheck, title: "Zero signup", desc: "Pick a test. Start. Done." },
            ].map((f, i) => (
              <div
                key={f.title}
                className="rounded-xl border border-ink/10 bg-card p-3.5 transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-soft sm:p-4"
                style={{ animation: `fade-up 0.45s ${i * 40}ms both` }}
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background sm:h-9 sm:w-9">
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-2.5 font-display text-sm font-bold sm:text-base">{f.title}</h3>
                <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-[13px]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — "Ready for next mock" — redesigned glossy blue card */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
        <div
          className="relative overflow-hidden rounded-[28px] p-8 text-background shadow-elevated sm:p-12"
          style={{
            background:
              "radial-gradient(120% 90% at 18% 22%, oklch(0.72 0.18 262 / 0.55) 0%, transparent 55%), linear-gradient(135deg, oklch(0.38 0.27 268) 0%, oklch(0.30 0.22 268) 100%)",
          }}
        >
          {/* soft splash highlights */}
          <div
            className="pointer-events-none absolute -left-10 -top-16 h-72 w-72 rounded-full bg-white/25 blur-3xl"
            style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
          />
          <div
            className="pointer-events-none absolute right-[-4rem] bottom-[-5rem] h-80 w-80 rounded-full bg-primary-glow/40 blur-3xl"
            style={{ animation: "float 6s ease-in-out infinite" }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-background/75">
                Ready for next mock
              </div>
              <h3 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                Pick a test, hit start &amp; see your score the moment you submit.
              </h3>
              <p className="mt-3 max-w-xl text-sm text-background/85 sm:text-base">
                No signup. No friction. Just exam-grade mocks built for serious aspirants.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-background ring-2 ring-background/30 shadow-soft">
                <img src={logoVx} alt="VidyaX" className="h-full w-full object-cover" />
              </span>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-bold text-foreground shadow-soft transition-transform hover:scale-[1.03] active:scale-95"
              >
                Browse categories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 pb-24 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">FAQ</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Everything you need to know before your first attempt.
          </p>
        </div>
        <div className="mt-10 divide-y-2 divide-ink/10 rounded-2xl border-2 border-ink/10 bg-card">
          {[
            {
              q: "Do I need to sign up to attempt a test?",
              a: "No. Pick a category, open any test, and start instantly — no account, no email, no friction.",
            },
            {
              q: "Does the test run in full-screen?",
              a: "Yes. The moment you hit Start Test, VidyaX goes full-screen for a distraction-free exam feel. Press Esc anytime to exit.",
            },
            {
              q: "Can I navigate between questions freely?",
              a: "Yes. Use the big Previous / Next buttons or open the palette drawer to jump anywhere in the paper.",
            },
            {
              q: "What happens when time runs out?",
              a: "The test auto-submits with whatever answers you've marked and takes you straight to your detailed result.",
            },
            {
              q: "Is my progress saved if I refresh?",
              a: "Yes. Your answers, marks-for-review and remaining time are saved locally so you can resume mid-test.",
            },
          ].map((item, i) => (
            <details
              key={item.q}
              className="group px-5 py-4 transition-colors first:rounded-t-2xl last:rounded-b-2xl open:bg-surface sm:px-6 sm:py-5"
              style={{ animation: `fade-up 0.4s ${i * 50}ms both` }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-foreground sm:text-base">
                {item.q}
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink/15 text-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
