import { createMiddleware } from "@tanstack/react-start";
import { createClient } from "./middleware";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const responseHeaders = new Headers();
  const supabase = createClient(request, { headers: responseHeaders });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const result = await next({
    context: {
      user,
      session,
    },
  });

  // If result is a Response, append the cookies from Supabase
  if (result instanceof Response) {
    responseHeaders.forEach((value, key) => {
      result.headers.append(key, value);
    });
  }

  return result;
});
