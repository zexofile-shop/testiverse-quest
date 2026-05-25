import { createServerFn } from "@tanstack/react-start";

export const proxySupabase = createServerFn("POST", async (payload: { path: string; method: string; body?: any; search?: string }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials missing");
  }

  const url = `${supabaseUrl}/${payload.path}${payload.search ?? ""}`;

  // Headers in createServerFn can be accessed via getWebRequest() or context if passed
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

  return await response.json();
});
