export async function submitTestResult(payload: {
  test_id: string;
  score: number;
  total_marks: number;
  answers: unknown[];
  accuracy: number;
  time_taken_seconds: number;
}) {
  const response = await fetch("/api/v1/adhyayx/test_results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to submit results");
  return await response.json();
}
