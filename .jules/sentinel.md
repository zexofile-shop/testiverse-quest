# Sentinel Journal

## 2025-05-15 - [Vulnerability] Unrestricted Supabase Proxy

**Vulnerability:** The `proxySupabase` server function was an unauthenticated, unrestricted gateway to the Supabase REST API, allowing any client to perform any operation (including mutations) on any table.
**Learning:** Even when using `createServerFn` to hide secrets, the proxy logic itself must enforce authentication, path whitelisting, and identity propagation (JWT forwarding) to maintain the security boundary.
**Prevention:** Always implement a strict whitelist of allowed endpoints for proxies, verify user authentication for sensitive operations, and use the user's own session token when communicating with backend services to enable Row Level Security (RLS).
