"use client";

import { usePathname } from "next/navigation";
import { useActivePathname } from "@/lib/use-active-pathname";

export const PAGES_ROUTER_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/auth",
] as const;

export function isPagesRouterPath(path: string) {
  return PAGES_ROUTER_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  const path = href.split("#")[0] ?? href;
  if (path === "/") {
    return pathname === "/";
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** Pathname for navbar highlighting in hybrid App + Pages Router. */
export function useNavbarPathname(): string {
  const appPathname = usePathname();
  const windowPathname = useActivePathname();

  if (isPagesRouterPath(windowPathname)) {
    return windowPathname;
  }

  return appPathname ?? windowPathname;
}
