"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Comment ça marche", href: "/#comment-ca-marche" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false; // Hash links are anchors, never "active"
    return pathname.startsWith(href);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-white/100 shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
          : "bg-white/80 backdrop-blur-md shadow-none"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" onClick={() => setMenuOpen(false)}>
            <Image
              src="/images/logo.png"
              alt="Manel.k - La maison des voiles"
              width={140}
              height={140}
              className="h-16 md:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-300"
                  style={{ color: active ? "#CFA4B8" : "#1A1A1A" }}
                >
                  {link.label}
                  {/* Hover underline animation */}
                  <span
                    className={`absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 rounded-full transition-all duration-300 ease-out ${
                      active
                        ? "w-3/5 bg-[#CFA4B8]"
                        : "w-0 bg-[#CFA4B8] group-hover:w-3/5"
                    }`}
                  />
                </Link>
              );
            })}

            {/* CTA Button */}
            <Link
              href="/personnaliser"
              className="ml-4 inline-flex items-center rounded-full bg-[#CFA4B8] px-5 py-2 text-[13px] font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#c294a8] hover:shadow-md active:scale-[0.97]"
            >
              Commander
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className={`block h-[2px] w-5 rounded-full bg-[#1A1A1A] transition-all duration-300 ease-out ${
                menuOpen
                  ? "translate-y-[7px] rotate-45"
                  : "translate-y-0 rotate-0"
              }`}
            />
            <span
              className={`mt-[5px] block h-[2px] rounded-full bg-[#1A1A1A] transition-all duration-300 ease-out ${
                menuOpen ? "w-0 opacity-0" : "w-5 opacity-100"
              }`}
            />
            <span
              className={`mt-[5px] block h-[2px] w-5 rounded-full bg-[#1A1A1A] transition-all duration-300 ease-out ${
                menuOpen
                  ? "-translate-y-[7px] -rotate-45"
                  : "translate-y-0 rotate-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-16 bg-white transition-all duration-400 ease-out md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col px-6 pt-8 pb-10 transition-all duration-400 ease-out ${
            menuOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          {navLinks.map((link, i) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group border-b border-gray-100 py-4 transition-all duration-300"
                style={{
                  transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateX(0)" : "translateX(-12px)",
                }}
              >
                <span
                  className="text-[15px] font-medium tracking-wide transition-colors duration-300"
                  style={{ color: active ? "#CFA4B8" : "#1A1A1A" }}
                >
                  {link.label}
                </span>
                {active && (
                  <span className="ml-3 inline-block h-1.5 w-1.5 rounded-full bg-[#CFA4B8]" />
                )}
              </Link>
            );
          })}

          {/* Mobile CTA */}
          <Link
            href="/personnaliser"
            onClick={() => setMenuOpen(false)}
            className="mt-8 flex items-center justify-center rounded-full bg-[#CFA4B8] px-6 py-3.5 text-[14px] font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#c294a8] active:scale-[0.97]"
            style={{
              transitionDelay: menuOpen ? `${navLinks.length * 60}ms` : "0ms",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(8px)",
            }}
          >
            Commander
          </Link>
        </div>
      </div>
    </nav>
  );
}
