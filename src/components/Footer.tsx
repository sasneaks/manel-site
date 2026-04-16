import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Créer mon bouquet", href: "/personnaliser" },
  { label: "Contact", href: "/contact" },
];

const infoItems = [
  "Livraison en France",
  "Paiement sécurisé via PayPal",
  "Fait main avec soin",
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Centered Logo */}
        <div className="flex flex-col items-center mb-12">
          <Image
            src="/images/logo.png"
            alt="Manel.k - La maison des voiles"
            width={160}
            height={160}
            className="h-20 w-auto"
          />
          <p className="mt-4 text-sm text-white/50 text-center max-w-sm leading-relaxed">
            Bouquets de voiles faits main, pour offrir un cadeau unique et plein d&apos;émotion.
          </p>
        </div>

        {/* Separator */}
        <div className="border-t border-white/10 mb-12" />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:gap-12">
          {/* Column 1 – Navigation */}
          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#CFA4B8]">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 – Informations */}
          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#CFA4B8]">
              Informations
            </h3>
            <ul className="space-y-3">
              {infoItems.map((item) => (
                <li
                  key={item}
                  className="text-sm text-white/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Social */}
          <div className="text-center sm:text-left">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#CFA4B8]">
              Suivez-nous
            </h3>
            <a
              href="https://www.instagram.com/manel.k_95"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-sm text-white/70 transition-colors duration-200 hover:text-[#CFA4B8]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@manel.k_95</span>
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-14 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          &copy; 2025 Manel.k &mdash; La maison des voiles. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
}
