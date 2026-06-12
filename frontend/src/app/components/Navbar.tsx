"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notifyAuthChange } from "@/lib/auth/local-user";
import { useLoggedIn } from "@/lib/auth/use-logged-in";
import {
  clearFavoriteIdsCache,
  peekFavoriteIds,
  prefetchFavoriteIds,
} from "@/lib/favorites-cache";
import { peekRecipeList, prefetchRecipeList } from "@/lib/recipe-list-cache";
import { useActivePathname } from "@/lib/use-active-pathname";

const NAV_LINKS = [
  { href: "/", label: "Hem" },
  { href: "/recept", label: "Recept" },
  { href: "/sparade", label: "Sparade" },
  { href: "/about", label: "Om" },
] as const;

const PAGES_ROUTER_PREFIXES = ["/login", "/register", "/forgot-password", "/auth"] as const;

function isPagesRouterPath(path: string) {
  return PAGES_ROUTER_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

type NavbarLinkProps = {
  href: string;
  className: string;
  children: React.ReactNode;
  onNavigate?: () => void;
};

/** Pages Router → App Router: vanlig länk undviker dubbelklick i hybrid Next.js. */
function NavbarLink({ href, className, children, onNavigate }: NavbarLinkProps) {
  const pathname = useActivePathname();
  const crossRouter =
    isPagesRouterPath(pathname) && !isPagesRouterPath(href.split("#")[0] ?? href);

  if (crossRouter) {
    return (
      <a href={href} className={className} onClick={onNavigate}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onNavigate} prefetch>
      {children}
    </Link>
  );
}

const Navbar = () => {
  const pathname = useActivePathname();
  const isLoggedIn = useLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenuAfterNavigate = () => {
    queueMicrotask(() => setMenuOpen(false));
  };

  useEffect(() => {
    const onPopState = () => setMenuOpen(false);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!peekRecipeList()) {
      prefetchRecipeList();
    }
    if (isLoggedIn && peekFavoriteIds() === undefined) {
      prefetchFavoriteIds();
    }
  }, [isLoggedIn]);

  const onLogout = () => {
    window.localStorage.removeItem("receptbok.user");
    clearFavoriteIdsCache();
    notifyAuthChange();
    window.location.href = "/";
  };

  const linkClass = (href: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
    return [
      "rounded-full px-3 py-2 text-sm font-medium transition",
      active
        ? "bg-rose-50 text-rose-800"
        : "text-stone-700 hover:bg-stone-100 hover:text-stone-950",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <NavbarLink
          href="/"
          className="text-lg font-bold tracking-tight text-stone-950"
          onNavigate={closeMenuAfterNavigate}
        >
          Receptbok
        </NavbarLink>
        <button
          type="button"
          className="inline-flex rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Stäng" : "Meny"}
        </button>
        <div
          id="primary-nav"
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-2 border-b border-stone-200 bg-white px-4 py-4 shadow-sm md:static md:flex md:flex-row md:items-center md:justify-end md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {NAV_LINKS.map((link) => (
            <NavbarLink
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              onNavigate={closeMenuAfterNavigate}
            >
              {link.label}
            </NavbarLink>
          ))}
          <NavbarLink
            href="/recept#nytt-recept"
            className="rounded-full bg-rose-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800"
            onNavigate={closeMenuAfterNavigate}
          >
            Nytt recept
          </NavbarLink>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            >
              Logga ut
            </button>
          ) : (
            <NavbarLink
              href="/login"
              className="rounded-full border border-stone-300 px-3 py-2 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
              onNavigate={closeMenuAfterNavigate}
            >
              Logga in
            </NavbarLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
