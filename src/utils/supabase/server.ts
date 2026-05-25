import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getCookies, setCookie, deleteCookie } from "vinxi/http";

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
