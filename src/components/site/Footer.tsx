import logoAdhyay from "@/assets/logo-adhyayx.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink/10 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white ring-2 ring-background/20">
                <img src={logoAdhyay} alt="AdhyayX" className="h-full w-full object-contain p-0.5" />
              </span>
              <div className="font-display text-xl font-bold">
                Adhyay<span className="text-primary-glow">X</span>
              </div>
              <span className="rounded-full border border-background/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-background/70">
                Powered by EduSpark
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm italic text-background/80">
              “Har Adhyay, Ek Nayi Jeet.”
            </p>
            <p className="mt-2 max-w-md text-sm text-background/70">
              Exam-grade mocks for JEE, NEET, boards & other competitive exams. Built to feel like the real thing.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-background/70">
            <a href="#features" className="hover:text-background transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-background transition-colors">
              FAQ
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Terms
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-background/15 pt-6 text-xs text-background/60">
          © {new Date().getFullYear()} AdhyayX · Powered by EduSpark. Crafted for serious aspirants.
        </div>
      </div>
    </footer>
  );
}
