import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function createClient(request: Request, response: { headers: Headers }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get("Cookie") ?? "";
        return cookieHeader.split(";").map((c) => {
          const [name, ...value] = c.trim().split("=");
          return { name, value: value.join("=") };
        });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieStr = `${name}=${value}${options?.maxAge ? `; Max-Age=${options.maxAge}` : ""}${options?.path ? `; Path=${options.path}` : ""}${options?.domain ? `; Domain=${options.domain}` : ""}${options?.secure ? "; Secure" : ""}${options?.httpOnly ? "; HttpOnly" : ""}`;
          response.headers.append("Set-Cookie", cookieStr);
        });
      },
    },
  });
}
