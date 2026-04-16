"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  // 3 voiles
  {
    name: "Bouquet Douceur",
    description: "Taupe, beige & gris",
    image: "/images/bouquet-beige.jpg",
    voiles: 3,
    price: "12",
  },
  {
    name: "Bouquet Trio",
    description: "Moutarde, blanc & noir",
    image: "/images/bouquet4.jpg",
    voiles: 3,
    price: "12",
  },
  // 4 voiles
  {
    name: "Bouquet Romantique",
    description: "Rose, lavande, rouge & vert sauge",
    image: "/images/bouquet9.jpg",
    voiles: 4,
    price: "15",
  },
  // 5 voiles
  {
    name: "Bouquet Océan",
    description: "Camaïeu de bleus avec gysophiles",
    image: "/images/bouquet5.jpg",
    voiles: 5,
    price: "18",
  },
  {
    name: "Bouquet Classique",
    description: "Blanc, rouge, noir, marron & gris",
    image: "/images/hero.jpg",
    voiles: 5,
    price: "18",
  },
  {
    name: "Bouquet Pastel",
    description: "Vert, blanc, bordeaux, violet & rose",
    image: "/images/bouquet6.jpg",
    voiles: 5,
    price: "18",
  },
  {
    name: "Bouquet Soleil",
    description: "Jaune, corail, bordeaux, menthe & rouge",
    image: "/images/bouquet7.jpg",
    voiles: 5,
    price: "18",
  },
  {
    name: "Bouquet Automne",
    description: "Beige, marron, rose, lavande & chocolat",
    image: "/images/bouquet8.jpg",
    voiles: 5,
    price: "18",
  },
  {
    name: "Bouquet Horizon",
    description: "Gris, blanc & bleu avec rose éternelle",
    image: "/images/bouquet-bleu.jpg",
    voiles: 5,
    price: "18",
  },
  {
    name: "Bouquet Nature",
    description: "Kaki, gris & noir avec gysophiles",
    image: "/images/bouquet2.jpg",
    voiles: 5,
    price: "18",
  },
  {
    name: "Bouquet Nuit Bleue",
    description: "Bleu ciel, bleu marine, noir & blanc",
    image: "/images/bouquet3.jpg",
    voiles: 5,
    price: "18",
  },
];

type Filter = "Tous" | "1 voile" | "3 voiles" | "4 voiles" | "5 voiles";

const filters: Filter[] = ["Tous", "1 voile", "3 voiles", "4 voiles", "5 voiles"];

export default function BoutiquePage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Tous");
  const [fading, setFading] = useState(false);

  const handleFilter = useCallback(
    (filter: Filter) => {
      if (filter === activeFilter) return;
      setFading(true);
      setTimeout(() => {
        setActiveFilter(filter);
        setFading(false);
      }, 200);
    },
    [activeFilter]
  );

  const filtered =
    activeFilter === "Tous"
      ? products
      : products.filter(
          (p) => p.voiles === parseInt(activeFilter.split(" ")[0])
        );

  return (
    <main className="min-h-screen bg-[#FDF8FA]">
      {/* Header */}
      <section className="pt-24 pb-6 px-4 text-center">
        <span className="inline-block text-[#CFA4B8] text-sm font-medium tracking-widest uppercase mb-4">
          Collection
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
          Notre Boutique
        </h1>
        <p className="text-lg text-[#1A1A1A]/60 max-w-2xl mx-auto leading-relaxed">
          Découvrez nos bouquets de voiles faits main, prêts à offrir ou à
          s&apos;offrir. Chaque bouquet est composé avec soin.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-10">
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-[#CFA4B8] text-white shadow-md shadow-[#CFA4B8]/25"
                  : "bg-white text-[#1A1A1A]/70 hover:bg-[#F6E8EF] hover:text-[#1A1A1A] border border-[#EAD3DD]/60"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-200 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          {filtered.map((product) => (
            <div
              key={product.name}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Voiles Badge */}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#CFA4B8] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {product.voiles} voiles
                </span>
              </div>

              {/* Info */}
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-[#1A1A1A] text-sm md:text-base leading-tight">
                    {product.name}
                  </h3>
                  <span className="text-[#CFA4B8] font-bold text-base md:text-lg whitespace-nowrap">
                    <span className="text-[9px] md:text-xs font-normal text-[#1A1A1A]/40">dès </span>{product.price}&euro;
                  </span>
                </div>
                <p className="text-[#1A1A1A]/50 text-xs md:text-sm mb-4 leading-relaxed flex-1">
                  {product.description}
                </p>
                <Link
                  href={`/personnaliser?voiles=${product.voiles}`}
                  className="group/btn relative block w-full text-center bg-[#CFA4B8] hover:bg-[#b8899e] text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 overflow-hidden"
                >
                  <span className="relative z-10">Commander</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && !fading && (
          <div className="text-center py-20">
            <p className="text-[#1A1A1A]/40 text-lg">
              Aucun bouquet dans cette catégorie pour le moment.
            </p>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-gradient-to-br from-[#F6E8EF] to-[#EAD3DD] rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3">
            Envie d&apos;un bouquet sur mesure ?
          </h2>
          <p className="text-[#1A1A1A]/60 mb-8 max-w-md mx-auto leading-relaxed">
            Choisissez vos couleurs, le nombre de voiles et créez un bouquet qui
            vous ressemble.
          </p>
          <Link
            href="/personnaliser"
            className="inline-flex items-center gap-2 bg-[#CFA4B8] hover:bg-[#b8899e] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-[#CFA4B8]/25 hover:shadow-xl hover:shadow-[#CFA4B8]/30"
          >
            Personnalisez le vôtre
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
