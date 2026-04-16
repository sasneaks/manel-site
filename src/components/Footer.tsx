import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Créer mon bouquet", href: "/personnaliser" },
  { label: "Contact", href: "/contact" },
];

const infoItems = [
  "Livraison dans toute la France",
  "Paiement sécurisé via PayPal",
  "Fait main avec soin",
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-16 md:px-6 lg:px-8">
        {/* Centered Logo */}
        <div className="flex flex-col items-center mb-6 md:mb-12">
          <Image
            src="/images/logo.png"
            alt="Manel.k - La maison des voiles"
            width={160}
            height={160}
            className="h-14 md:h-20 w-auto"
          />
          <p className="mt-2 md:mt-4 text-xs md:text-sm text-white/50 text-center max-w-sm leading-relaxed">
            Des bouquets de voiles faits main pour offrir un cadeau unique, même avec un petit budget.
          </p>
        </div>

        {/* Separator */}
        <div className="border-t border-white/10 mb-6 md:mb-12" />

        <div className="grid grid-cols-3 gap-4 md:gap-10 lg:gap-12">
          {/* Column 1 – Navigation */}
          <div className="text-center sm:text-left">
            <h3 className="mb-2 md:mb-4 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#CFA4B8]">
              Navigation
            </h3>
            <ul className="space-y-1.5 md:space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[11px] md:text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 – Informations */}
          <div className="text-center sm:text-left">
            <h3 className="mb-2 md:mb-4 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#CFA4B8]">
              Informations
            </h3>
            <ul className="space-y-1.5 md:space-y-3">
              {infoItems.map((item) => (
                <li
                  key={item}
                  className="text-[11px] md:text-sm text-white/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Social */}
          <div className="text-center sm:text-left">
            <h3 className="mb-2 md:mb-4 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#CFA4B8]">
              Suivez-nous
            </h3>
            <a
              href="https://www.instagram.com/manel.k_95"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 md:gap-3 text-[11px] md:text-sm text-white/70 transition-colors duration-200 hover:text-[#CFA4B8] mb-2 md:mb-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 md:h-5 md:w-5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@manel.k_95</span>
            </a>
            <a
              href="https://www.snapchat.com/add/manel.k95"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 md:gap-3 text-[11px] md:text-sm text-white/70 transition-colors duration-200 hover:text-[#FFFC00]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 md:h-5 md:w-5"
              >
                <path d="M12 2C9.8 2 8.2 3.1 7.4 5c-.5 1.2-.4 3.6-.2 5.2-.5.2-1.1.2-1.6-.1-.5-.2-.9-.2-1.2 0-.5.3-.5.8-.2 1.3.4.6 1.1 1.1 1.8 1.4.4.2.7.3 1 .5.4.2.5.4.4.8-.5 1.4-1.5 3-3 4.1-.5.3-1 .6-1.5.8-.6.2-.9.6-.8 1.2.1.6.7 1 1.8 1.3l.4.1c.7.2.8.4.9 1.1.1.3.1.6.3 1 .2.4.6.6 1.1.6.4 0 .8-.1 1.2-.2.8-.2 1.7-.5 2.9-.3.6.1 1.1.3 1.7.6 1.3.6 2.9 1.4 5.2 1.4h.1c2.3 0 3.9-.8 5.2-1.4.6-.3 1.1-.5 1.7-.6 1.2-.2 2.1.1 2.9.3.4.1.9.2 1.2.2.5 0 .9-.2 1.1-.6.2-.4.3-.7.3-1 .1-.7.3-.9.9-1.1l.4-.1c1.1-.3 1.7-.7 1.8-1.3.1-.6-.2-1-.8-1.2-.5-.2-1-.5-1.5-.8-1.5-1.1-2.5-2.7-3-4.1-.1-.4 0-.6.4-.8.3-.2.6-.3 1-.5.7-.3 1.4-.8 1.8-1.4.3-.5.3-1-.2-1.3-.3-.2-.7-.2-1.2 0-.5.2-1.1.3-1.6.1.2-1.6.3-4-.2-5.2C15.8 3.1 14.2 2 12 2z" />
              </svg>
              <span>manel.k95</span>
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-6 md:mt-14 border-t border-white/10 pt-4 md:pt-8 text-center text-[10px] md:text-xs text-white/40">
          &copy; 2025 Manel.k &mdash; La maison des voiles. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
}
