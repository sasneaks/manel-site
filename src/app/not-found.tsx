import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "linear-gradient(180deg, #F6E8EF 0%, #ffffff 100%)" }}
    >
      <div className="text-center max-w-md">
        <p className="text-[#CFA4B8] text-sm font-medium tracking-widest uppercase mb-4">
          Erreur 404
        </p>
        <h1
          className="text-5xl sm:text-6xl font-bold text-[#1A1A1A] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Page introuvable
        </h1>
        <p className="text-lg text-[#1A1A1A]/60 leading-relaxed mb-10">
          Desolee, la page que vous cherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#CFA4B8] px-8 py-3.5 text-white font-medium text-base shadow-lg hover:bg-[#b8899e] hover:shadow-xl transition-all duration-300"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
