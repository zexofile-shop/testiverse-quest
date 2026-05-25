import { createServerFn } from "@tanstack/react-start";

export const proxySupabase = createServerFn("POST", async (payload: { path: string; method: string; body?: any; search?: string }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials missing");
  }

  const url = `${supabaseUrl}/${payload.path}${payload.search ?? ""}`;

  const headers = new Headers();
  headers.set("apikey", supabaseKey);
  headers.set("Authorization", `Bearer ${supabaseKey}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(url, {
    method: payload.method,
    headers,
    body: payload.body ? JSON.stringify(payload.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  return await response.json();
});
