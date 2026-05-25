import { proxySupabase } from "@/utils/supabase/proxy";

export async function submitTestResult(payload: {
  test_id: string;
  score: number;
  total_marks: number;
  answers: any[];
  accuracy: number;
  time_taken_seconds: number;
}) {
  return await proxySupabase({
    method: "POST",
    path: "rest/v1/test_results",
    body: payload,
  });
}
