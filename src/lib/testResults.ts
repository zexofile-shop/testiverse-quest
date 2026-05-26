// Local-only result storage (no database). Saves the last few attempts to localStorage.

export async function submitTestResult(payload: {
  test_id: string;
  score: number;
  total_marks: number;
  answers: unknown[];
  accuracy: number;
  time_taken_seconds: number;
}) {
  try {
    if (typeof window === "undefined") return { success: true };
    const key = "adhyayx.results";
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    prev.unshift({ ...payload, saved_at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(prev.slice(0, 25)));
  } catch {
    // ignore
  }
  return { success: true };
}
