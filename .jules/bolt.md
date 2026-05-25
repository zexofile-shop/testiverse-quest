# Bolt's Journal - Critical Learnings Only

This journal tracks critical performance-related learnings.

## 2026-05-24 - High-frequency render optimization in Test Runner

**Learning:** In components with high-frequency updates (e.g., a 1-second timer), performing O(N) array operations (like mapping, filtering, and grouping) in the render body causes significant cumulative overhead. Even if individual operations are fast, they block the main thread every second.

**Action:** Always memoize derived data and group/filter logic in components with timers. Use `React.memo` for sub-components (like the question palette) that don't need to re-render on every timer tick.
