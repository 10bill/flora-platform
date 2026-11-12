"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/useCart";
import { mainNav } from "@/lib/navigation";
import { site } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="font-display text-[34px] font-semibold italic leading-none text-bloom"
        >
          {site.name}
          <span className="text-ink">.</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-9 lg:flex">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-[16px] font-medium transition-colors hover:text-bloom after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-bloom after:transition-all ${
                  active
                    ? "text-bloom after:w-full"
                    : "text-ink-soft after:w-0 hover:after:w-full"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/commander"
            onClick={closeMenu}
            aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-cream transition hover:bg-bloom"
          >
            Panier
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yolk px-1.5 text-[11px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-ink text-ink transition hover:bg-ink hover:text-cream lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          className="border-t border-line bg-cream px-5 pb-6 pt-2 sm:px-8 lg:hidden"
        >
          <ul>
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-dashed border-line-strong">
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block py-4 font-display text-[28px] transition-colors hover:text-bloom ${
                    isActive(item.href) ? "text-bloom" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
