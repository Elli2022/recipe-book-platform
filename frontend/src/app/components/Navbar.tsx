"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AUTH_CHANGE_EVENT, getStoredUser, notifyAuthChange } from "@/lib/auth/local-user";

const Navbar = () => {
  const pathname = usePathname() ?? "/";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    const sync = () => setIsLoggedIn(Boolean(getStoredUser()));
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const onLogout = () => {
    window.localStorage.removeItem("receptbok.user");
    setIsLoggedIn(false);
    notifyAuthChange();
    window.location.href = "/";
  };

  const links = [
    { href: "/", label: "Hem" },
    { href: "/recept", label: "Recept" },
    { href: "/sparade", label: "Sparade" },
    { href: "/about", label: "Om" },
  ];

  const linkClass = (href: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
    return [
      "rounded-full px-3 py-2 text-sm font-medium transition",
      active
        ? "bg-emerald-50 text-emerald-800"
        : "text-stone-700 hover:bg-stone-100 hover:text-stone-950",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-stone-950">
          Receptbok
        </Link>

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
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/recept#nytt-recept"
            className="rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Nytt recept
          </Link>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            >
              Logga ut
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-stone-300 px-3 py-2 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            >
              Logga in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
