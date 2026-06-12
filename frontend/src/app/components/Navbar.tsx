"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notifyAuthChange } from "@/lib/auth/local-user";
import { useLoggedIn } from "@/lib/auth/use-logged-in";
import { prefetchRecipeList } from "@/lib/recipe-list-cache";
import { useActivePathname } from "@/lib/use-active-pathname";

const NAV_LINKS = [
  { href: "/", label: "Hem" },
  { href: "/recept", label: "Recept" },
  { href: "/sparade", label: "Sparade" },
  { href: "/about", label: "Om" },
] as const;

const Navbar = () => {
  const router = useRouter();
  const pathname = useActivePathname();
  const isLoggedIn = useLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    for (const link of NAV_LINKS) {
      router.prefetch(link.href);
    }
    prefetchRecipeList();
  }, [router]);

  const closeMenu = () => setMenuOpen(false);

  const onLogout = () => {
    window.localStorage.removeItem("receptbok.user");
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
        <Link href="/" onClick={closeMenu} className="text-lg font-bold tracking-tight text-stone-950" prefetch>
          Receptbok
        </Link>
        <button type="button" className="inline-flex rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 md:hidden" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? "Stäng" : "Meny"}
        </button>
        <div id="primary-nav" className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-2 border-b border-stone-200 bg-white px-4 py-4 shadow-sm md:static md:flex md:flex-row md:items-center md:justify-end md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)} onClick={closeMenu} prefetch>
              {link.label}
            </Link>
          ))}
          <Link href="/recept#nytt-recept" onClick={closeMenu} prefetch className="rounded-full bg-rose-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800">
            Nytt recept
          </Link>
          {isLoggedIn ? (
            <button type="button" onClick={onLogout} className="rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950">
              Logga ut
            </button>
          ) : (
            <Link href="/login" onClick={closeMenu} className="rounded-full border border-stone-300 px-3 py-2 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950">
              Logga in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
