import { createStart, createMiddleware } from "@tanstack/react-start";
import { createClient as createMiddlewareClient } from "./utils/supabase/middleware";
import { renderErrorPage } from "./lib/error-page";

const supabaseMiddleware = createMiddleware().server(async ({ next, request }) => {
  const response = { headers: new Headers() };
  const supabase = createMiddlewareClient(request, response);

  // This will refresh the session if it's expired
  await supabase.auth.getUser();

  const result = await next();

  // If result is a Response, append the cookies from Supabase
  if (result instanceof Response) {
    response.headers.forEach((value, key) => {
      result.headers.append(key, value);
    });
  }

  return result;
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [supabaseMiddleware, errorMiddleware],
}));
