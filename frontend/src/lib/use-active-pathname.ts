"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let historyPatched = false;
let originalPushState: History["pushState"];
let originalReplaceState: History["replaceState"];

function notifyPathnameListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function ensureHistoryPatched() {
  if (typeof window === "undefined" || historyPatched) {
    return;
  }

  historyPatched = true;
  originalPushState = window.history.pushState.bind(window.history);
  originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args) => {
    const result = originalPushState(...args);
    notifyPathnameListeners();
    return result;
  };

  window.history.replaceState = (...args) => {
    const result = originalReplaceState(...args);
    notifyPathnameListeners();
    return result;
  };
}

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  ensureHistoryPatched();
  listeners.add(onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("hashchange", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("hashchange", onStoreChange);
  };
};

const getSnapshot = () =>
  typeof window === "undefined" ? "/" : window.location.pathname;

/** Works in both App Router and Pages Router (hybrid Next.js). */
export function useActivePathname(): string {
  return useSyncExternalStore(subscribe, getSnapshot, () => "/");
}
