"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const notify = () => onStoreChange();
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);

  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener("hashchange", notify);
  };
};

const getSnapshot = () =>
  typeof window === "undefined" ? "/" : window.location.pathname;

/** Works in both App Router and Pages Router (hybrid Next.js). */
export function useActivePathname(): string {
  return useSyncExternalStore(subscribe, getSnapshot, () => "/");
}
