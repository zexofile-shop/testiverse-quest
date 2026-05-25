# Bolt's Journal - Critical Learnings

## 2025-05-15 - [Manual API Proxy for TanStack Start]
**Learning:** The installed version of `@tanstack/react-start` (1.168.13) did not support the `./api` export or `createAPIFileRoute` pattern as expected in newer documentation.
**Action:** Instead of fighting package versions, implemented a manual `fetch` interceptor in `src/server.ts` to handle the requested `/api/v1/adhyayx/` proxy. This ensures the API appears under the brand name without breaking the build.

## 2025-05-15 - [Vercel Deployment Configuration]
**Learning:** Default TanStack Start deployments on Vercel may encounter 404s on sub-routes because the underlying Nitro engine needs explicit preset configuration.
**Action:** Set `nitro: { preset: 'vercel' }` in `vite.config.ts` and used `{"framework": "tanstack-start"}` in `vercel.json` to ensure proper routing and SSR functionality on Vercel.

## 2025-05-15 - [Re-render Optimization Strategy]
**Learning:** Frequent timer ticks (1s) in complex components like `TestRunner` cause significant $O(N)$ re-render overhead if state is not carefully segmented.
**Action:** Use `React.memo` for static UI elements and `useMemo` for derived calculations (like status filtering) to keep the main thread responsive during timed exams. (Note: These were temporarily reverted to prioritize deployment fixes but remain a key optimization target).
