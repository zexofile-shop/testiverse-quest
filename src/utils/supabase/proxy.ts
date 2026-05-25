import { createServerFn } from "@tanstack/react-start";

const ALLOWED_PATHS = ["rest/v1/tests", "rest/v1/questions", "rest/v1/test_results"];

export const proxySupabase = createServerFn({ method: "POST" }).handler(
  async ({ data, context }) => {
    const { user, session } = context;

    if (!ALLOWED_PATHS.includes(data.path)) {
      throw new Error(`Forbidden path: ${data.path}`);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing");
    }

    if (data.method !== "GET" && !user) {
      throw new Error("Unauthorized: Please sign in to perform this action.");
    }

    // Enforce user_id for test_results to prevent spoofing
    let finalBody = data.body;
    if (data.path === "rest/v1/test_results" && data.method === "POST" && user) {
      finalBody = { ...(data.body as Record<string, unknown>), user_id: user.id };
    }

    const url = `${supabaseUrl}/${data.path}${data.search ?? ""}`;

    const headers = new Headers();
    headers.set("apikey", supabaseKey);
    // Use user's access token if available, else fallback to anon key
    headers.set("Authorization", `Bearer ${session?.access_token || supabaseKey}`);
    headers.set("Content-Type", "application/json");

    const response = await fetch(url, {
      method: data.method,
      headers,
      body: finalBody ? JSON.stringify(finalBody) : undefined,
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
  },
);
