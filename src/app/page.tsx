"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const whyCards = [
  {
    title: "Cadeau original",
    description: "Un présent unique qui surprend et émerveille à chaque fois.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 19.5v-8.25M12 4.875A2.625 2.625 0 009.375 7.5H12m0-2.625A2.625 2.625 0 0114.625 7.5H12m0-2.625V7.5m0 0H3.375a1.125 1.125 0 00-1.125 1.125v2.25a1.125 1.125 0 001.125 1.125H12m0-4.5h8.625a1.125 1.125 0 011.125 1.125v2.25a1.125 1.125 0 01-1.125 1.125H12" />
      </svg>
    ),
  },
  {
    title: "Personnalisable",
    description: "Choisissez les couleurs qui correspondent à vos envies.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "Fait main avec soin",
    description: "Chaque bouquet est confectionné à la main avec amour.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Idéal pour surprendre",
    description: "Parfait pour les anniversaires, mariages et moments spéciaux.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

const bouquets = [
  {
    title: "Bouquet 3 voiles",
    price: "12",
    description: "Un trio élégant pour un cadeau délicat et raffiné.",
    image: "/images/bouquet-beige.jpg",
  },
  {
    title: "Bouquet 4 voiles",
    price: "15",
    description: "L'équilibre parfait entre douceur et générosité.",
    image: "/images/bouquet9.jpg",
  },
  {
    title: "Bouquet 5 voiles",
    price: "18",
    description: "Un bouquet généreux pour marquer les grandes occasions.",
    image: "/images/bouquet7.jpg",
  },
  {
    title: "Bouquet 5 voiles",
    price: "18",
    description: "Tons bleus avec gysophiles, un classique intemporel.",
    image: "/images/bouquet5.jpg",
  },
];

const galleryImages = [
  { src: "/images/bouquet2.jpg", alt: "Création bouquet de voiles 1" },
  { src: "/images/bouquet5.jpg", alt: "Création bouquet de voiles 2" },
  { src: "/images/bouquet7.jpg", alt: "Création bouquet de voiles 3" },
  { src: "/images/bouquet8.jpg", alt: "Création bouquet de voiles 4" },
  { src: "/images/bouquet9.jpg", alt: "Création bouquet de voiles 5" },
  { src: "/images/bouquet-bleu.jpg", alt: "Création bouquet de voiles 6" },
];

const steps = [
  { number: "1", title: "Choisissez votre bouquet", description: "Sélectionnez le nombre de voiles souhaité." },
  { number: "2", title: "Personnalisez les couleurs", description: "Composez votre palette parmi nos teintes élégantes." },
  { number: "3", title: "Recevez votre bouquet", description: "Livré avec soin, prêt à offrir." },
];

const testimonials = [
  {
    name: "Amina R.",
    text: "J'ai offert un bouquet de 5 voiles à ma soeur pour son anniversaire. Elle était tellement émue ! Les couleurs étaient exactement comme je les avais choisies. Merci Manel !",
    stars: 5,
  },
  {
    name: "Fatima B.",
    text: "Un cadeau original et raffiné. La qualité des voiles est superbe et la présentation en bouquet est magnifique. Je recommande les yeux fermés.",
    stars: 5,
  },
  {
    name: "Nour S.",
    text: "Commande livrée rapidement et soigneusement emballée. Le bouquet de 4 voiles était parfait pour un cadeau de mariage. Tout le monde a adoré !",
    stars: 5,
  },
];

/* ──────────────────────────────────────────────
   Star SVG component
   ────────────────────────────────────────────── */

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 20 20"
      fill={filled ? "#CFA4B8" : "none"}
      stroke="#CFA4B8"
      strokeWidth={1.5}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────── */

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Manel.k - La maison des voiles",
    description: "Bouquets de voiles faits main et personnalisables. Cadeau unique et plein d'émotion.",
    url: "https://lamaisondesvoiles.fr",
    image: "https://lamaisondesvoiles.fr/opengraph-image.jpg",
    priceRange: "5€ - 50€",
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    sameAs: ["https://www.instagram.com/manel.k_95"],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "5",
      highPrice: "50",
      offerCount: "4",
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ───────────────── Hero ───────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #F6E8EF 0%, #ffffff 100%)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-36 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-14">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-[#CFA4B8] font-medium mb-4">
              Manel.k
            </p>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-[#1A1A1A]"
                          >
              La maison
              <br />
              des voiles
            </h1>
            <p className="mt-4 md:mt-6 text-base sm:text-xl text-[#1A1A1A]/70 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Des bouquets de voiles faits main pour offrir un cadeau unique et plein d&apos;émotion.
            </p>
            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/personnaliser"
                className="inline-flex items-center justify-center rounded-full bg-[#CFA4B8] px-8 py-3.5 text-white font-medium text-base shadow-lg hover:bg-[#b8899e] hover:shadow-xl transition-all duration-300"
              >
                Créer mon bouquet
              </Link>
              <Link
                href="#bouquets"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#CFA4B8] px-8 py-3.5 text-[#CFA4B8] font-medium text-base hover:bg-[#CFA4B8] hover:text-white transition-all duration-300"
              >
                Voir la boutique
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 w-full max-w-[280px] md:max-w-lg relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
            <Image
              src="/images/WhatsApp Image 2026-03-24 at 20.04.35.jpeg"
              alt="Bouquet de voiles fait main"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Decorative floating shape */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#F6E8EF]/50 blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#EAD3DD]/30 blur-3xl pointer-events-none" />
      </section>

      {/* ───────────────── Why Section ───────────────── */}
      <section className="py-12 md:py-32 bg-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            className="scroll-reveal text-center text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 md:mb-4"
                      >
            Pourquoi offrir un bouquet de voiles&nbsp;?
          </h2>
          <p className="scroll-reveal text-center text-sm md:text-base text-[#1A1A1A]/60 max-w-2xl mx-auto mb-8 md:mb-16">
            Un cadeau fait main qui allie élégance, douceur et originalité.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {whyCards.map((card, i) => (
              <div
                key={card.title}
                className={`scroll-reveal delay-${i + 1} group flex flex-col items-center text-center bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-[#F6E8EF] hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="mb-3 md:mb-5 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#F6E8EF] flex items-center justify-center text-[#CFA4B8] group-hover:bg-[#CFA4B8] group-hover:text-white transition-all duration-300 [&_svg]:w-5 [&_svg]:h-5 md:[&_svg]:w-8 md:[&_svg]:h-8">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] text-sm md:text-lg mb-1 md:mb-2">{card.title}</h3>
                <p className="text-xs md:text-sm text-[#1A1A1A]/60 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Bouquets Section ───────────────── */}
      <section
        id="bouquets"
        className="py-12 md:py-32"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #F6E8EF40 100%)" }}
      >
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            className="scroll-reveal text-center text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 md:mb-4"
                      >
            Choisissez votre bouquet
          </h2>
          <p className="scroll-reveal text-center text-sm md:text-base text-[#1A1A1A]/60 max-w-2xl mx-auto mb-8 md:mb-16">
            Du plus délicat au plus généreux, trouvez le bouquet parfait.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {bouquets.map((bouquet, i) => (
              <div
                key={bouquet.title}
                className={`scroll-reveal delay-${i + 1} group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F6E8EF] hover:shadow-xl transition-all duration-300`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={bouquet.image}
                    alt={bouquet.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                    <span className="text-[#CFA4B8] font-bold text-lg">{bouquet.price}&euro;</span>
                  </div>
                </div>
                <div className="p-3 md:p-5">
                  <h3 className="font-semibold text-[#1A1A1A] text-sm md:text-lg mb-0.5 md:mb-1">{bouquet.title}</h3>
                  <p className="text-xs md:text-sm text-[#1A1A1A]/60 leading-relaxed mb-2 md:mb-4 line-clamp-2">{bouquet.description}</p>
                  <Link
                    href="/personnaliser"
                    className="inline-flex items-center justify-center w-full rounded-full bg-[#CFA4B8] px-5 py-2.5 text-white text-sm font-medium hover:bg-[#b8899e] transition-colors duration-300"
                  >
                    Commander
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Gallery Section ───────────────── */}
      <section className="py-12 md:py-32 bg-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            className="scroll-reveal text-center text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 md:mb-4"
                      >
            Nos créations
          </h2>
          <p className="scroll-reveal text-center text-sm md:text-base text-[#1A1A1A]/60 max-w-2xl mx-auto mb-6 md:mb-16">
            Chaque bouquet est unique, confectionné avec soin et amour.
          </p>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4">
            {galleryImages.map((img, i) => (
              <Link
                key={img.src}
                href="/personnaliser"
                className={`scroll-reveal delay-${Math.min(i + 1, 5)} group relative overflow-hidden rounded-xl md:rounded-2xl ${
                  i === 0 || i === 5 ? "md:row-span-2 aspect-square md:aspect-[3/4]" : "aspect-square"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/40 transition-all duration-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    Voir la boutique
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── How it Works ───────────────── */}
      <section
        id="comment-ca-marche"
        className="py-12 md:py-32"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #F6E8EF 100%)" }}
      >
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h2
            className="scroll-reveal text-center text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 md:mb-4"
                      >
            Comment ça marche
          </h2>
          <p className="scroll-reveal text-center text-sm md:text-base text-[#1A1A1A]/60 max-w-2xl mx-auto mb-8 md:mb-20">
            En trois étapes simples, recevez votre bouquet personnalisé.
          </p>
          <div className="relative flex flex-row items-start justify-between gap-4 md:gap-0">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-0.5 bg-[#EAD3DD]" />

            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`scroll-reveal delay-${i + 1} flex-1 flex flex-col items-center text-center relative z-10`}
              >
                {/* Number circle */}
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#CFA4B8] text-white flex items-center justify-center text-base md:text-2xl font-bold shadow-lg mb-3 md:mb-6 ring-2 md:ring-4 ring-white">
                  {step.number}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] text-xs md:text-lg mb-1 md:mb-2">{step.title}</h3>
                <p className="text-[10px] md:text-sm text-[#1A1A1A]/60 max-w-[220px] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Testimonials ───────────────── */}
      <section className="py-12 md:py-32 bg-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            className="scroll-reveal text-center text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 md:mb-4"
                      >
            Ce que disent nos clientes
          </h2>
          <p className="scroll-reveal text-center text-sm md:text-base text-[#1A1A1A]/60 max-w-2xl mx-auto mb-6 md:mb-16">
            Elles ont offert nos bouquets et elles en parlent.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`scroll-reveal delay-${i + 1} bg-[#F6E8EF]/40 rounded-2xl p-5 md:p-8 border border-[#EAD3DD]/50 min-w-[260px] md:min-w-0 snap-center shrink-0 md:shrink`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 md:gap-1 mb-3 md:mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <StarIcon key={si} filled={si < t.stars} />
                  ))}
                </div>
                {/* Quote icon */}
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#CFA4B8]/30 mb-2 md:mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <p className="text-[#1A1A1A]/70 leading-relaxed mb-4 md:mb-6 text-xs md:text-sm">
                  {t.text}
                </p>
                <p className="font-semibold text-[#1A1A1A] text-xs md:text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA Section ───────────────── */}
      <section className="py-12 md:py-32 bg-[#F6E8EF]">
        <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
          <h2
            className="scroll-reveal text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-3 md:mb-5"
                      >
            Créez votre bouquet sur mesure
          </h2>
          <p className="scroll-reveal text-base md:text-lg text-[#1A1A1A]/70 mb-6 md:mb-10 max-w-xl mx-auto leading-relaxed">
            Personnalisez les couleurs et offrez un cadeau unique
          </p>
          <div className="scroll-reveal">
            <Link
              href="/personnaliser"
              className="inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-10 py-4 text-white font-medium text-base shadow-lg hover:bg-[#333] hover:shadow-xl transition-all duration-300"
            >
              Personnaliser mon bouquet
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
