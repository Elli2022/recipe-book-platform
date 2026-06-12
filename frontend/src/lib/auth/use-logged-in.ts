import { useSyncExternalStore } from "react";
import { AUTH_CHANGE_EVENT, getStoredUser } from "./local-user";

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const notify = () => onStoreChange();
  window.addEventListener(AUTH_CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
};

const getSnapshot = () =>
  typeof window !== "undefined" && Boolean(getStoredUser());

/** Synkront efter hydration — ingen setTimeout-flash. */
export function useLoggedIn(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
