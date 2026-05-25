# Bolt's Journal - Critical Learnings Only

This journal tracks critical performance-related learnings.

## 2026-05-24 - High-frequency render optimization in Test Runner

**Learning:** In components with high-frequency updates (e.g., a 1-second timer), performing O(N) array operations (like mapping, filtering, and grouping) in the render body causes significant cumulative overhead. Even if individual operations are fast, they block the main thread every second.

**Action:** Always memoize derived data and group/filter logic in components with timers. Use `React.memo` for sub-components (like the question palette) that don't need to re-render on every timer tick.

## 2026-05-24 - Throttled persistence for high-frequency state

**Learning:** Persisting state to `localStorage` on every tick of a 1-second timer creates unnecessary I/O pressure and UI micro-stutters due to `JSON.stringify` overhead.

**Action:** Use a `ref` to track high-frequency state (like `secondsLeft`) for callbacks, and implement a throttled `useEffect` (e.g., every 10s) for persistence. Ensure the "important" state (like answers) still persists immediately but uses the `ref` to include the current timer value without being triggered by it.

## 2026-05-24 - Callback stability with timers

**Learning:** If a component has a timer-driven state, any callback depending on that state (like a `submit` function) will be recreated every second. If that callback is passed to a memoized sub-component (like a question palette), the sub-component will re-render every second, defeating the memoization.

**Action:** Use `useRef` to capture the current value of the timer and use that ref inside the callback. Remove the timer state from the callback's dependency array to stabilize it.
