import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getCookies, setCookie, deleteCookie } from "vinxi/http";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          const cookies = getCookies();
          return Object.entries(cookies).map(([name, value]) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            setCookie(name, value, options as any),
          );
        },
      },
    },
  );
}
