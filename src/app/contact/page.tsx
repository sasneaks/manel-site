"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Turnstile } from "@marsidev/react-turnstile";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const turnstileRef = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", instagram: "", message: "" });
        setTurnstileToken("");
        turnstileRef.current?.reset();
      } else {
        setStatus("error");
        turnstileRef.current?.reset();
      }
    } catch {
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF8FA]">
      {/* Header */}
      <section className="pt-24 pb-6 px-4 text-center">
        <span className="inline-block text-[#CFA4B8] text-sm font-medium tracking-widest uppercase mb-4">
          Contact
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
          Contactez-nous
        </h1>
        <p className="text-lg text-[#1A1A1A]/60 max-w-xl mx-auto leading-relaxed">
          Une question, une demande particulière ? N&apos;hésitez pas à nous
          écrire.
        </p>
      </section>

      {/* Split Layout */}
      <section className="max-w-6xl mx-auto px-4 pb-24 pt-6">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
          {/* Left: Form (3 cols) */}
          <div className="md:col-span-3 order-2 md:order-1">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-sm text-[#1A1A1A]/40 mb-8">
                Réponse rapide, souvent dans la journée.
              </p>

              {status === "sent" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#F6E8EF] rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg
                      className="w-8 h-8 text-[#CFA4B8]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-[#1A1A1A]/50 mb-6">
                    Merci ! On revient vers vous très vite.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[#CFA4B8] font-medium hover:underline underline-offset-4"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5"
                      >
                        Nom
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="w-full bg-[#FDF8FA] border border-[#EAD3DD]/50 rounded-xl px-4 py-3 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#CFA4B8]/40 focus:border-transparent transition"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="w-full bg-[#FDF8FA] border border-[#EAD3DD]/50 rounded-xl px-4 py-3 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#CFA4B8]/40 focus:border-transparent transition"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5"
                    >
                      Instagram
                      <span className="text-[#1A1A1A]/30 font-normal ml-1">
                        (optionnel)
                      </span>
                    </label>
                    <input
                      id="instagram"
                      type="text"
                      value={form.instagram}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, instagram: e.target.value }))
                      }
                      className="w-full bg-[#FDF8FA] border border-[#EAD3DD]/50 rounded-xl px-4 py-3 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#CFA4B8]/40 focus:border-transparent transition"
                      placeholder="@votre_compte"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className="w-full bg-[#FDF8FA] border border-[#EAD3DD]/50 rounded-xl px-4 py-3 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#CFA4B8]/40 focus:border-transparent transition resize-none"
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <div className="flex justify-center">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={setTurnstileToken}
                      options={{ theme: "light", size: "normal" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending" || !turnstileToken}
                    className="w-full bg-[#CFA4B8] hover:bg-[#b8899e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-[#CFA4B8]/20 hover:shadow-lg hover:shadow-[#CFA4B8]/25"
                  >
                    {status === "sending" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      "Envoyer le message"
                    )}
                  </button>

                  {status === "error" && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                      <p className="text-red-600 text-sm font-medium">
                        Une erreur est survenue.
                      </p>
                      <p className="text-red-500/70 text-xs mt-1">
                        Veuillez réessayer ou nous contacter sur Instagram.
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Right: Info (2 cols) */}
          <div className="md:col-span-2 order-1 md:order-2 flex flex-col gap-6">
            {/* Brand Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Manel.k - La maison des voiles"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">
                Manel.k
              </h2>
              <p className="text-[#1A1A1A]/50 text-sm">
                La maison des voiles
              </p>
            </div>

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/manel.k_95"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#F6E8EF] to-[#EAD3DD] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-[#CFA4B8]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/40 font-medium">
                  Suivez-nous sur Instagram
                </p>
                <p className="font-semibold text-[#1A1A1A]">@manel.k_95</p>
              </div>
              <svg
                className="w-4 h-4 text-[#1A1A1A]/20 ml-auto group-hover:text-[#CFA4B8] group-hover:translate-x-0.5 transition-all duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </a>

            {/* Horaires */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F6E8EF] to-[#EAD3DD] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[#CFA4B8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1A1A1A]">Horaires</h3>
              </div>
              <p className="text-[#1A1A1A]/60 text-sm leading-relaxed">
                Disponible 7j/7 sur Instagram
              </p>
            </div>

            {/* Mini FAQ */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1A1A1A] mb-5">
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F6E8EF] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-[#CFA4B8]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      Délai de livraison
                    </p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-0.5">
                      2-5 jours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F6E8EF] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-[#CFA4B8]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      Paiement
                    </p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-0.5">
                      Après contact
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F6E8EF] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-[#CFA4B8]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">Zone</p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-0.5">France</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
