"use client";

import { useState, useCallback, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import BouquetPreview from "@/components/BouquetPreview";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

/* ───────────────────────── Types ───────────────────────── */

interface OrderResponse {
  orderNumber: string;
}

/* ──────────────────────── Colors ───────────────────────── */

const AVAILABLE_COLORS: { name: string; hex: string }[] = [
  { name: "Blanc", hex: "#FFFFFF" },
  { name: "Noir", hex: "#1A1A1A" },
  { name: "Gris", hex: "#9CA3AF" },
  { name: "Beige", hex: "#D4B896" },
  { name: "Taupe", hex: "#8B7D6B" },
  { name: "Marron", hex: "#6B4423" },
  { name: "Bleu", hex: "#3B82F6" },
  { name: "Bleu marine", hex: "#1E3A5F" },
  { name: "Bleu ciel", hex: "#87CEEB" },
  { name: "Rose", hex: "#F9A8D4" },
  { name: "Rouge", hex: "#DC2626" },
  { name: "Bordeaux", hex: "#722F37" },
  { name: "Vert sauge", hex: "#9CAF88" },
  { name: "Violet", hex: "#8B5CF6" },
  { name: "Moutarde", hex: "#D4A017" },
  { name: "Corail", hex: "#FF7F50" },
  { name: "Menthe", hex: "#98FF98" },
  { name: "Lavande", hex: "#E6E6FA" },
];

const VEIL_OPTIONS = [
  { count: 1, price: 5 },
  { count: 3, price: 12 },
  { count: 4, price: 15 },
  { count: 5, price: 18 },
] as const;

const SUPPLEMENTS = [
  { name: "Rose éternelle blanche", price: 1, emoji: "\uD83C\uDF39" },
  { name: "Chocolats", price: 3, emoji: "\uD83C\uDF6B" },
  { name: "Gysophiles", price: 4, emoji: "\uD83C\uDF3C" },
  { name: "Quatre épingles", price: 1, emoji: "\uD83D\uDCCC" },
] as const;

const DELIVERY_OPTIONS = [
  { id: "surplace", label: "Retrait sur place", sublabel: "Gratuit — venez chercher votre bouquet", price: 0, emoji: "📍" },
  { id: "mainpropre", label: "Livraison en main propre", sublabel: "Dans un rayon de 30 min — 10€", price: 10, emoji: "🚗" },
  { id: "mondialrelay", label: "Mondial Relay", sublabel: "Livraison en point relais — France", price: 5.90, emoji: "📦" },
] as const;

const TOTAL_STEPS = 7;

/* ──────────────────────── Page ────────────────────────── */

export default function PersonnaliserPage() {
  return (
    <Suspense>
      <PersonnaliserContent />
    </Suspense>
  );
}

function PersonnaliserContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [veilCount, setVeilCount] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [giftMessage, setGiftMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  const [extraMessage, setExtraMessage] = useState("");
  const [supplements, setSupplements] = useState<string[]>([]);
  const [billetsAmount, setBilletsAmount] = useState("");

  const [deliveryChoice, setDeliveryChoice] = useState<string>("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentChoice, setPaymentChoice] = useState<"acompte" | "total" | "">("");
  const [turnstileToken, setTurnstileToken] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const turnstileRef = useRef<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  /* ── Pre-select veil count from query param ── */
  useEffect(() => {
    const voilesParam = searchParams.get("voiles");
    if (voilesParam) {
      const count = parseInt(voilesParam, 10);
      if (VEIL_OPTIONS.some((v) => v.count === count)) {
        setVeilCount(count);
      }
    }
  }, [searchParams]);

  /* ── Color helpers ── */

  const handleColorPick = useCallback(
    (colorName: string) => {
      if (activeSlot !== null) {
        // Replace the color in the active slot
        setSelectedColors((prev) => {
          const next = [...prev];
          next[activeSlot] = colorName;
          return next;
        });
        setActiveSlot(null);
      } else if (selectedColors.length < veilCount) {
        // Add to the next empty slot
        setSelectedColors((prev) => [...prev, colorName]);
      } else {
        // All slots full — replace the last one directly
        setSelectedColors((prev) => {
          const next = [...prev];
          next[next.length - 1] = colorName;
          return next;
        });
      }
    },
    [activeSlot, selectedColors.length, veilCount],
  );

  const handleSlotClick = useCallback((index: number) => {
    if (selectedColors[index]) {
      setActiveSlot((prev) => (prev === index ? null : index));
    }
  }, [selectedColors]);

  /* ── Price calculation ── */

  const toggleSupplement = (name: string) => {
    setSupplements((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const basePrice = VEIL_OPTIONS.find((v) => v.count === veilCount)?.price ?? 0;
  const suppTotal = supplements.reduce((sum, s) => {
    const found = SUPPLEMENTS.find((sup) => sup.name === s);
    return sum + (found?.price ?? 0);
  }, 0);
  const billetsTotal = supplements.includes("Billets") && billetsAmount ? parseFloat(billetsAmount) + 10 : 0;
  const shippingPrice = DELIVERY_OPTIONS.find((d) => d.id === deliveryChoice)?.price ?? 0;
  const subtotal = basePrice + suppTotal + billetsTotal;
  const totalPrice = subtotal + shippingPrice;

  /* ── Navigation ── */

  const canGoNext = (): boolean => {
    if (step === 1) return veilCount > 0;
    if (step === 2) return selectedColors.length === veilCount;
    if (step === 3) return true; // supplements optional
    if (step === 4) return true; // gift message optional
    if (step === 5)
      return (
        name.trim() !== "" &&
        email.trim() !== "" &&
        phone.trim() !== "" &&
        address.trim() !== ""
      );
    if (step === 6) {
      if (deliveryChoice === "") return false;
      if (deliveryChoice === "mondialrelay" && postalCode.trim().length < 5) return false;
      return true;
    }
    if (step === 7) return paymentChoice !== "";
    return false;
  };

  const next = () => {
    if (canGoNext() && step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const prev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  /* ── Submit ── */

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      veilCount,
      colors: selectedColors,
      supplements,
      billetsAmount,
      totalPrice,
      giftMessage,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      instagram: instagram.trim(),
      extraMessage: extraMessage.trim(),
      deliveryChoice,
      shippingPrice,
      postalCode: postalCode.trim(),
      paymentChoice,
      turnstileToken,
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Une erreur est survenue.");
      }

      const data: OrderResponse = await res.json();
      setOrderNumber(data.orderNumber);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Hex lookup ── */

  const hexFor = (colorName: string) =>
    AVAILABLE_COLORS.find((c) => c.name === colorName)?.hex ?? "#CCC";

  /* ──────────── Confirmation screen ──────────── */

  if (orderNumber) {
    return (
      <main className="min-h-screen bg-[#F6E8EF] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#CFA4B8] flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
            Merci pour votre commande&nbsp;!
          </h1>
          <p className="text-[#1A1A1A]/70 mb-4">
            Votre numéro de commande&nbsp;:
          </p>
          <p className="text-xl font-bold text-[#CFA4B8] mb-6">
            {orderNumber}
          </p>
          <p className="text-sm text-[#1A1A1A]/60">
            Nous vous contacterons très bientôt pour confirmer les détails.
          </p>
        </div>
      </main>
    );
  }

  /* ──────────── Main layout ──────────── */

  return (
    <main className="min-h-screen bg-[#F6E8EF] text-[#1A1A1A]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-14">
        {/* Header */}
        <h1 className="text-center text-2xl md:text-3xl font-semibold mb-8">
          Personnalisez votre bouquet
        </h1>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between text-xs md:text-sm font-medium mb-2">
            {["Voiles", "Couleurs", "Extras", "Message", "Infos", "Livraison", "Paiement"].map((label, i) => (
              <span
                key={label}
                className={
                  i + 1 <= step ? "text-[#CFA4B8]" : "text-[#1A1A1A]/40"
                }
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 rounded-full bg-[#1A1A1A]/10 overflow-hidden">
            <div
              className="h-full bg-[#CFA4B8] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left: steps ── */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 min-h-[340px]">
              {/* STEP 1 */}
              {step === 1 && (
                <StepWrapper title="Combien de voiles ?">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {VEIL_OPTIONS.map((v) => (
                      <button
                        key={v.count}
                        onClick={() => {
                          setVeilCount(v.count);
                          setSelectedColors((prev) => prev.slice(0, v.count));
                        }}
                        className={`rounded-xl border-2 py-5 transition-all duration-200 cursor-pointer flex flex-col items-center gap-1 ${
                          veilCount === v.count
                            ? "border-[#CFA4B8] bg-[#CFA4B8]/10 text-[#CFA4B8]"
                            : "border-[#1A1A1A]/10 hover:border-[#CFA4B8]/50"
                        }`}
                      >
                        <span className="text-2xl font-semibold">{v.count}</span>
                        <span className="text-sm font-medium opacity-70">{v.price}€</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-[#1A1A1A]/40">Voile unique : 5€</p>
                </StepWrapper>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <StepWrapper title="Choisissez vos couleurs">
                  {/* Selected slots */}
                  <div className="flex flex-wrap gap-3 mb-2">
                    {Array.from({ length: veilCount }).map((_, i) => {
                      const color = selectedColors[i];
                      const isActive = activeSlot === i;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSlotClick(i)}
                          className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                            isActive
                              ? "border-[#1A1A1A] scale-110 ring-2 ring-[#CFA4B8] ring-offset-2 cursor-pointer"
                              : color
                                ? "border-[#CFA4B8] cursor-pointer hover:scale-110"
                                : "border-dashed border-[#1A1A1A]/20"
                          }`}
                          style={color ? { backgroundColor: hexFor(color) } : {}}
                          title={color ? (isActive ? `${color} – choisissez une nouvelle couleur` : `${color} – cliquez pour remplacer`) : `Voile ${i + 1}`}
                        >
                          {!color && (
                            <span className="text-[#1A1A1A]/30 text-xs">
                              {i + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {activeSlot !== null && (
                    <p className="text-xs text-[#CFA4B8] font-medium mb-4 animate-pulse">
                      Choisissez la nouvelle couleur pour le voile {activeSlot + 1}
                    </p>
                  )}

                  {/* Palette */}
                  <p className="text-sm text-[#1A1A1A]/50 mb-3">
                    {selectedColors.length}/{veilCount} sélectionnée
                    {selectedColors.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_COLORS.map((c) => {
                      return (
                        <button
                          key={c.name}
                          onClick={() => handleColorPick(c.name)}
                          className="group flex flex-col items-center gap-1 cursor-pointer"
                          title={c.name}
                        >
                          <span
                            className={`w-10 h-10 rounded-full block transition-transform duration-150 group-hover:scale-110 ${
                              c.hex === "#FFFFFF"
                                ? "border border-[#1A1A1A]/20"
                                : ""
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[10px] text-[#1A1A1A]/60 leading-tight text-center max-w-[56px]">
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </StepWrapper>
              )}

              {/* STEP 3 - Supplements */}
              {step === 3 && (
                <StepWrapper title="Suppléments (optionnel)">
                  <div className="grid gap-3">
                    {SUPPLEMENTS.map((sup) => (
                      <button
                        key={sup.name}
                        onClick={() => toggleSupplement(sup.name)}
                        className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 transition-all duration-200 cursor-pointer ${
                          supplements.includes(sup.name)
                            ? "border-[#CFA4B8] bg-[#CFA4B8]/10"
                            : "border-[#1A1A1A]/10 hover:border-[#CFA4B8]/50"
                        }`}
                      >
                        <span className="text-2xl">{sup.emoji}</span>
                        <span className="font-medium text-sm flex-1 text-left">{sup.name}</span>
                        <span className={`text-sm font-semibold ${supplements.includes(sup.name) ? "text-[#CFA4B8]" : "text-[#1A1A1A]/50"}`}>+{sup.price}€</span>
                      </button>
                    ))}
                    {/* Billets option */}
                    <button
                      onClick={() => toggleSupplement("Billets")}
                      className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 transition-all duration-200 cursor-pointer ${
                        supplements.includes("Billets")
                          ? "border-[#CFA4B8] bg-[#CFA4B8]/10"
                          : "border-[#1A1A1A]/10 hover:border-[#CFA4B8]/50"
                      }`}
                    >
                      <span className="text-2xl">💵</span>
                      <div className="flex-1 text-left">
                        <span className="font-medium text-sm block">Billets en fleur</span>
                        <span className="text-[11px] text-[#1A1A1A]/40">Billets pliés à la main en forme de rose (+10€ de mise en forme)</span>
                      </div>
                      <span className={`text-sm font-semibold ${supplements.includes("Billets") ? "text-[#CFA4B8]" : "text-[#1A1A1A]/50"}`}>Somme + 10€</span>
                    </button>
                    {supplements.includes("Billets") && (
                      <div className="ml-4">
                        <label className="block text-sm font-medium mb-1 text-[#1A1A1A]/70">Montant des billets (€)</label>
                        <input
                          type="number"
                          min="0"
                          value={billetsAmount}
                          onChange={(e) => setBilletsAmount(e.target.value)}
                          placeholder="Ex: 50"
                          className="w-full rounded-xl border border-[#1A1A1A]/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CFA4B8] transition"
                        />
                      </div>
                    )}
                  </div>
                </StepWrapper>
              )}

              {/* STEP 4 - Message */}
              {step === 4 && (
                <StepWrapper title="Message cadeau (optionnel)">
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    rows={5}
                    placeholder="Écrivez ici un petit mot pour accompagner votre bouquet..."
                    className="w-full rounded-xl border border-[#1A1A1A]/15 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#CFA4B8] resize-none transition"
                  />
                </StepWrapper>
              )}

              {/* STEP 5 - Infos */}
              {step === 5 && (
                <StepWrapper title="Vos informations">
                  <div className="grid gap-4">
                    <Input
                      label="Nom"
                      value={name}
                      onChange={setName}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                    <Input
                      label="Téléphone"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      required
                    />
                    <Input
                      label="Instagram"
                      value={instagram}
                      onChange={setInstagram}
                      placeholder="@votre_compte"
                    />
                    <Input
                      label="Adresse"
                      value={address}
                      onChange={setAddress}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#1A1A1A]/70">
                        Message complémentaire
                      </label>
                      <textarea
                        value={extraMessage}
                        onChange={(e) => setExtraMessage(e.target.value)}
                        rows={3}
                        placeholder="Informations supplémentaires…"
                        className="w-full rounded-xl border border-[#1A1A1A]/15 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#CFA4B8] resize-none transition"
                      />
                    </div>
                  </div>
                </StepWrapper>
              )}

              {/* STEP 6 - Delivery choice */}
              {step === 6 && (
                <StepWrapper title="Mode de livraison">
                  <div className="grid gap-3">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setDeliveryChoice(opt.id);
                          if (opt.id === "mondialrelay") setPaymentChoice("total");
                          else if (paymentChoice === "total" && deliveryChoice === "mondialrelay") setPaymentChoice("");
                        }}
                        className={`flex items-center gap-4 rounded-xl border-2 px-5 py-5 transition-all duration-200 cursor-pointer text-left ${
                          deliveryChoice === opt.id
                            ? "border-[#CFA4B8] bg-[#CFA4B8]/10"
                            : "border-[#1A1A1A]/10 hover:border-[#CFA4B8]/50"
                        }`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <span className="font-semibold text-sm block">{opt.label}</span>
                          <span className="text-xs text-[#1A1A1A]/50">{opt.sublabel}</span>
                        </div>
                        <span className={`text-sm font-bold ${deliveryChoice === opt.id ? "text-[#CFA4B8]" : "text-[#1A1A1A]/50"}`}>
                          {opt.price === 0 ? "Gratuit" : `${opt.price}€`}
                        </span>
                      </button>
                    ))}
                  </div>
                  {deliveryChoice === "mondialrelay" && (
                    <div className="mt-5 p-4 bg-[#F6E8EF]/50 rounded-xl">
                      <label className="block text-sm font-medium mb-1.5 text-[#1A1A1A]/70">
                        Code postal du destinataire <span className="text-[#CFA4B8]">*</span>
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        placeholder="Ex: 75001"
                        maxLength={5}
                        className="w-full rounded-xl border border-[#1A1A1A]/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CFA4B8] transition"
                      />
                      <p className="text-xs text-[#1A1A1A]/40 mt-2">Manel trouvera le point relais le plus proche pour vous.</p>
                    </div>
                  )}
                </StepWrapper>
              )}

              {/* STEP 7 - Payment choice */}
              {step === 7 && (
                <StepWrapper title="Mode de paiement">
                  {deliveryChoice === "mondialrelay" ? (
                    <>
                      <div className="bg-[#FFF3E0] rounded-xl p-4 mb-6">
                        <p className="text-sm text-[#E65100] font-medium">Pour les envois Mondial Relay, le règlement intégral est requis avant expédition.</p>
                      </div>
                      <div className="grid gap-4">
                        <button
                          onClick={() => setPaymentChoice("total")}
                          className="flex flex-col rounded-xl border-2 px-6 py-5 transition-all duration-200 cursor-pointer text-left border-[#CFA4B8] bg-[#CFA4B8]/10"
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className="font-semibold text-sm">Règlement intégral</span>
                            <span className="text-lg font-bold text-[#CFA4B8]">{totalPrice}€</span>
                          </div>
                          <span className="text-xs text-[#1A1A1A]/50">Paiement requis avant expédition</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-[#1A1A1A]/60 mb-6">
                        Choisissez comment vous souhaitez régler votre commande. Vous recevrez un lien PayPal sécurisé par email.
                      </p>
                      <div className="grid gap-4">
                        <button
                          onClick={() => setPaymentChoice("acompte")}
                          className={`flex flex-col rounded-xl border-2 px-6 py-5 transition-all duration-200 cursor-pointer text-left ${
                            paymentChoice === "acompte"
                              ? "border-[#CFA4B8] bg-[#CFA4B8]/10"
                              : "border-[#1A1A1A]/10 hover:border-[#CFA4B8]/50"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className="font-semibold text-sm">Acompte (30%)</span>
                            <span className={`text-lg font-bold ${paymentChoice === "acompte" ? "text-[#CFA4B8]" : "text-[#1A1A1A]/50"}`}>{Math.ceil(totalPrice * 0.3)}€</span>
                          </div>
                          <span className="text-xs text-[#1A1A1A]/50">Versez 30% maintenant, le reste à la livraison</span>
                        </button>
                        <button
                          onClick={() => setPaymentChoice("total")}
                          className={`flex flex-col rounded-xl border-2 px-6 py-5 transition-all duration-200 cursor-pointer text-left ${
                            paymentChoice === "total"
                              ? "border-[#CFA4B8] bg-[#CFA4B8]/10"
                              : "border-[#1A1A1A]/10 hover:border-[#CFA4B8]/50"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className="font-semibold text-sm">Règlement intégral</span>
                            <span className={`text-lg font-bold ${paymentChoice === "total" ? "text-[#CFA4B8]" : "text-[#1A1A1A]/50"}`}>{totalPrice}€</span>
                          </div>
                          <span className="text-xs text-[#1A1A1A]/50">Réglez la totalité maintenant</span>
                        </button>
                      </div>
                    </>
                  )}
                  <div className="mt-6">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={setTurnstileToken}
                      options={{ theme: "light", size: "normal" }}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#1A1A1A]/40">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span>Paiement sécurisé via PayPal</span>
                  </div>
                </StepWrapper>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    onClick={prev}
                    className="px-6 py-2.5 rounded-full border border-[#CFA4B8] text-[#CFA4B8] text-sm font-medium hover:bg-[#CFA4B8]/10 transition cursor-pointer"
                  >
                    Précédent
                  </button>
                ) : (
                  <span />
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    onClick={next}
                    disabled={!canGoNext()}
                    className="px-6 py-2.5 rounded-full bg-[#CFA4B8] text-white text-sm font-medium hover:bg-[#CFA4B8]/90 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canGoNext() || submitting || !turnstileToken}
                    className="px-6 py-2.5 rounded-full bg-[#CFA4B8] text-white text-sm font-medium hover:bg-[#CFA4B8]/90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 cursor-pointer"
                  >
                    {submitting && (
                      <svg
                        className="animate-spin h-4 w-4"
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
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    )}
                    {submitting ? "Envoi en cours…" : "Envoyer ma commande"}
                  </button>
                )}
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* ── Right: preview + summary ── */}
          <aside className="lg:w-80 shrink-0">
            {/* Bouquet Preview */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 sticky top-8">
              <h2 className="font-semibold text-sm text-center mb-2 text-[#1A1A1A]/60 uppercase tracking-wide">Votre bouquet</h2>
              <BouquetPreview
                veilCount={veilCount}
                selectedColors={selectedColors}
                hexFor={hexFor}
                hasGysophiles={supplements.includes("Gysophiles")}
                hasRose={supplements.includes("Rose éternelle blanche")}
                hasChocolats={supplements.includes("Chocolats")}
                hasEpingles={supplements.includes("Quatre épingles")}
                hasBillets={supplements.includes("Billets")}
              />
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-[340px]">
              <h2 className="font-semibold text-lg mb-4">Récapitulatif</h2>

              {/* Veil count */}
              <div className="mb-4">
                <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-wide mb-1">
                  Nombre de voiles
                </p>
                <p className="font-medium">
                  {veilCount > 0 ? veilCount : "\u2014"}
                </p>
              </div>

              {/* Colors */}
              <div className="mb-4">
                <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-wide mb-2">
                  Couleurs
                </p>
                {selectedColors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-[#F6E8EF]/50 rounded-full px-2.5 py-1">
                        <span
                          className={`w-4 h-4 rounded-full block shrink-0 ${
                            hexFor(c) === "#FFFFFF"
                              ? "border border-[#1A1A1A]/20"
                              : ""
                          }`}
                          style={{ backgroundColor: hexFor(c) }}
                        />
                        <span className="text-xs">{c}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#1A1A1A]/40">\u2014</p>
                )}
              </div>

              {/* Supplements */}
              {supplements.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-wide mb-2">
                    Suppléments
                  </p>
                  <div className="flex flex-col gap-1">
                    {supplements.map((s) => (
                      <span key={s} className="text-sm text-[#1A1A1A]/70">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gift message */}
              {giftMessage.trim() && (
                <div className="mb-4">
                  <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-wide mb-1">
                    Message cadeau
                  </p>
                  <p className="text-sm italic text-[#1A1A1A]/70 whitespace-pre-line break-words">
                    &ldquo;{giftMessage.trim()}&rdquo;
                  </p>
                </div>
              )}

              {/* Delivery */}
              {deliveryChoice && (
                <div className="mb-4">
                  <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-wide mb-1">
                    Livraison
                  </p>
                  <p className="text-sm text-[#1A1A1A]/70">
                    {DELIVERY_OPTIONS.find((d) => d.id === deliveryChoice)?.label}
                    {shippingPrice > 0 && <span className="ml-1 font-medium">({shippingPrice}€)</span>}
                    {shippingPrice === 0 && <span className="ml-1 font-medium text-green-600">(Gratuit)</span>}
                  </p>
                </div>
              )}

              {/* Total */}
              {veilCount > 0 && (
                <div className="pt-4 mt-4 border-t border-[#F6E8EF]">
                  {shippingPrice > 0 && (
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-[#1A1A1A]/50">Sous-total</p>
                      <p className="text-sm text-[#1A1A1A]/50">{subtotal}€</p>
                    </div>
                  )}
                  {shippingPrice > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#1A1A1A]/50">Livraison</p>
                      <p className="text-sm text-[#1A1A1A]/50">{shippingPrice}€</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#1A1A1A]">Total</p>
                    <p className="text-xl font-bold text-[#CFA4B8]">{totalPrice}€</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ───────────────── Sub-components ──────────────────────── */

function StepWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-[fadeIn_0.35s_ease]">
      <h2 className="text-xl font-semibold mb-5">{title}</h2>
      {children}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-[#1A1A1A]/70">
        {label}
        {required && <span className="text-[#CFA4B8] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#1A1A1A]/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CFA4B8] transition"
      />
    </div>
  );
}
