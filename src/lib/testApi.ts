import answerKeyData from "@/data/answerKey.json";

const SUPABASE_URL = "https://gaqyuylvawgoxuaevhsi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcXl1eWx2YXdnb3h1YWV2aHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDExNTQsImV4cCI6MjA2Nzk3NzE1NH0.tRJXi5vTSopCza_61sYu2ccOrk8LR7UvJ07JPP07OEI";

const ANSWER_KEY = answerKeyData as Record<string, string>;

export interface Test {
  id: string;
  name: string;
  description: string | null;
  stream: string | null;
  duration_minutes: number;
  total_questions: number;
  category: string | null;
  exam_type: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  question_text: string | null;
  image: string | null;
  options: string | string[] | null;
  subject: string | null;
  marks: number;
  negative_marks: number;
  type: string;
  correct: string | null;
}

async function sb<T>(pathAndQuery: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/${pathAndQuery}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Accept-Profile": "public",
    },
  });
  if (!res.ok) throw new Error(`Supabase error ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export async function fetchTests(): Promise<Test[]> {
  const data = await sb<Test[]>(
    "rest/v1/tests?select=*&status=eq.active&order=stream.asc,created_at.desc",
  );
  return data.filter(
    (t) => !/testing/i.test(t.name ?? "") && !/testing/i.test(t.description ?? ""),
  );
}

export async function fetchQuestions(testId: string): Promise<Question[]> {
  const data = await sb<Question[]>(
    `rest/v1/questions?select=id,question_text,image,options,subject,marks,negative_marks,type,correct&test_id=eq.${testId}`,
  );
  // Override `correct` with bundled answer key for 100% accuracy
  return data.map((q) => {
    const fromKey = ANSWER_KEY[q.id];
    return fromKey ? { ...q, correct: fromKey } : q;
  });
}

export function normalizeSubject(
  subject: string | null | undefined,
  stream: string | null | undefined,
): string {
  const raw = String(subject ?? "").trim();
  const s = raw.toLowerCase();
  const st = String(stream ?? "").toLowerCase();

  let canonical = raw || "General";
  if (s.includes("phys")) canonical = "Physics";
  else if (s.includes("chem")) canonical = "Chemistry";
  else if (s.includes("bot")) canonical = "Botany";
  else if (s.includes("zoo")) canonical = "Zoology";
  else if (s.includes("bio")) canonical = "Biology";
  else if (s.includes("math")) canonical = "Mathematics";
  else if (s.includes("eng")) canonical = "English";

  const isNeet = st.includes("neet");
  const isJee = st.includes("jee");
  if (isNeet && canonical === "Mathematics") return "Biology";
  if (isJee && (canonical === "Biology" || canonical === "Botany" || canonical === "Zoology"))
    return "Mathematics";

  return canonical;
}

export function correctIndex(raw: string | null | undefined, opts: string[]): number {
  if (!raw) return -1;
  const v = String(raw).trim();
  if (!v) return -1;
  if (/^[A-Za-z]$/.test(v)) {
    const idx = v.toUpperCase().charCodeAt(0) - 65;
    return idx >= 0 && idx < opts.length ? idx : -1;
  }
  if (/^\d{1,2}$/.test(v)) {
    const n = parseInt(v, 10);
    if (n >= 1 && n <= opts.length) return n - 1;
    if (n >= 0 && n < opts.length) return n;
    return -1;
  }
  const match = opts.findIndex((o) => o.trim().toLowerCase() === v.toLowerCase());
  return match;
}

export function parseOptions(raw: string | string[] | null | undefined): string[] {
  let arr: unknown = raw;
  if (typeof raw === "string") {
    try {
      arr = JSON.parse(raw);
    } catch {
      arr = [];
    }
  }
  const list = Array.isArray(arr) ? arr.map((v) => String(v ?? "").trim()) : [];
  const cleaned = list.filter((s) => s.length > 0);
  if (cleaned.length === 0) return ["A", "B", "C", "D"];
  return cleaned;
}

export function detectOptionStyle(opts: string[]): "letter" | "number" | "text" {
  if (opts.length === 0) return "text";
  const isAllLetters = opts.every((o) => /^[A-Za-z]$/.test(o));
  if (isAllLetters) return "letter";
  const isAllNumbers = opts.every((o) => /^\d{1,2}$/.test(o));
  if (isAllNumbers) return "number";
  return "text";
}
