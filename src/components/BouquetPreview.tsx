"use client";

interface BouquetPreviewProps {
  veilCount: number;
  selectedColors: string[];
  hexFor: (name: string) => string;
  hasGysophiles: boolean;
  hasRose: boolean;
  hasChocolats: boolean;
  hasEpingles: boolean;
  hasBillets: boolean;
}

// Positions for veils arranged in a bouquet circle depending on count
const LAYOUTS: Record<number, { cx: number; cy: number; r: number }[]> = {
  1: [
    { cx: 135, cy: 95, r: 38 },
  ],
  3: [
    { cx: 120, cy: 85, r: 32 },
    { cx: 160, cy: 105, r: 32 },
    { cx: 130, cy: 120, r: 32 },
  ],
  4: [
    { cx: 115, cy: 80, r: 30 },
    { cx: 160, cy: 80, r: 30 },
    { cx: 105, cy: 118, r: 30 },
    { cx: 150, cy: 118, r: 30 },
  ],
  5: [
    { cx: 135, cy: 70, r: 28 },
    { cx: 170, cy: 90, r: 28 },
    { cx: 100, cy: 90, r: 28 },
    { cx: 120, cy: 125, r: 28 },
    { cx: 155, cy: 125, r: 28 },
  ],
  6: [
    { cx: 135, cy: 65, r: 26 },
    { cx: 170, cy: 82, r: 26 },
    { cx: 100, cy: 82, r: 26 },
    { cx: 110, cy: 118, r: 26 },
    { cx: 160, cy: 118, r: 26 },
    { cx: 135, cy: 100, r: 26 },
  ],
};

// Draw a "rose" shape (swirl petals) for one veil
function VeilFlower({ cx, cy, r, color, isEmpty }: { cx: number; cy: number; r: number; color: string; isEmpty: boolean }) {
  if (isEmpty) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A1A1A" strokeOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#1A1A1A" fillOpacity={0.2} fontSize={10}>?</text>
      </g>
    );
  }

  const isWhite = color === "#FFFFFF";
  const petalCount = 7;
  const petals = [];

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(angle) * r * 0.5;
    const py = cy + Math.sin(angle) * r * 0.5;
    petals.push(
      <ellipse
        key={`petal-${i}`}
        cx={px}
        cy={py}
        rx={r * 0.55}
        ry={r * 0.35}
        transform={`rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`}
        fill={color}
        stroke={isWhite ? "#e0d8dc" : undefined}
        strokeWidth={isWhite ? 0.5 : undefined}
        opacity={0.85 + (i % 2) * 0.15}
      />
    );
  }

  // Center swirl
  petals.push(
    <circle
      key="center"
      cx={cx}
      cy={cy}
      r={r * 0.25}
      fill={color}
      stroke={isWhite ? "#e0d8dc" : undefined}
      strokeWidth={isWhite ? 0.5 : undefined}
      filter="brightness(0.92)"
      style={{ filter: "brightness(0.9)" }}
    />
  );

  return <g className="transition-all duration-500">{petals}</g>;
}

// Small decorative dots for baby's breath (gysophiles)
function BabyBreath({ positions }: { positions: { x: number; y: number }[] }) {
  return (
    <g>
      {positions.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={2.5} fill="white" stroke="#d4ccc0" strokeWidth={0.3} />
          <circle cx={p.x + 5} cy={p.y - 4} r={2} fill="white" stroke="#d4ccc0" strokeWidth={0.3} />
          <circle cx={p.x - 3} cy={p.y - 6} r={1.8} fill="white" stroke="#d4ccc0" strokeWidth={0.3} />
          <line x1={p.x} y1={p.y + 2} x2={p.x} y2={p.y + 12} stroke="#9caf88" strokeWidth={0.6} opacity={0.5} />
        </g>
      ))}
    </g>
  );
}

// White rose eternelle
function WhiteRose({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const px = cx + Math.cos(rad) * 7;
        const py = cy + Math.sin(rad) * 7;
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={7}
            ry={4.5}
            transform={`rotate(${angle + 90}, ${px}, ${py})`}
            fill="white"
            stroke="#e8dfe3"
            strokeWidth={0.4}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={4} fill="#faf5f7" stroke="#e8dfe3" strokeWidth={0.3} />
    </g>
  );
}

// Chocolats — small wrapped chocolates tucked into the bouquet
function Chocolats() {
  const pieces = [
    { x: 82, y: 110, angle: -15 },
    { x: 185, y: 105, angle: 20 },
    { x: 95, y: 140, angle: -5 },
  ];
  return (
    <g>
      {pieces.map((p, i) => (
        <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.angle})`}>
          {/* Wrapper */}
          <rect x={-7} y={-5} width={14} height={10} rx={3} fill="#6B3A2A" />
          {/* Foil shine */}
          <rect x={-5} y={-3} width={4} height={6} rx={1.5} fill="#8B5E3C" opacity={0.6} />
          {/* Wrapper twist left */}
          <path d="M-7 0 L-12 -3 L-12 3 Z" fill="#D4A56A" opacity={0.8} />
          {/* Wrapper twist right */}
          <path d="M7 0 L12 -3 L12 3 Z" fill="#D4A56A" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

// Epingles — decorative pins with pearl heads
function Epingles() {
  const pins = [
    { x: 115, y: 60, angle: -30 },
    { x: 155, y: 58, angle: 15 },
    { x: 170, y: 75, angle: 35 },
    { x: 98, y: 78, angle: -20 },
  ];
  return (
    <g>
      {pins.map((p, i) => (
        <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.angle})`}>
          {/* Pin shaft */}
          <line x1={0} y1={0} x2={0} y2={14} stroke="#C0C0C0" strokeWidth={0.8} />
          {/* Pearl head */}
          <circle cx={0} cy={0} r={3} fill="#FAF5F7" stroke="#e0d8dc" strokeWidth={0.4} />
          <circle cx={-0.8} cy={-0.8} r={1} fill="white" opacity={0.7} />
        </g>
      ))}
    </g>
  );
}

// Billets — folded money bills sticking out
function Billets() {
  const bills = [
    { x: 78, y: 88, angle: -40 },
    { x: 190, y: 92, angle: 35 },
    { x: 168, y: 68, angle: 25 },
  ];
  return (
    <g>
      {bills.map((p, i) => (
        <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.angle})`}>
          {/* Bill body */}
          <rect x={-10} y={-6} width={20} height={12} rx={1} fill="#85BB65" stroke="#5A8F3C" strokeWidth={0.4} />
          {/* Bill inner frame */}
          <rect x={-8} y={-4} width={16} height={8} rx={0.5} fill="none" stroke="#5A8F3C" strokeWidth={0.3} opacity={0.5} />
          {/* Euro symbol */}
          <text x={0} y={2} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#3D6B2E" fontFamily="sans-serif">€</text>
          {/* Fold effect */}
          <line x1={-2} y1={-6} x2={-2} y2={6} stroke="#5A8F3C" strokeWidth={0.2} opacity={0.3} />
        </g>
      ))}
    </g>
  );
}

export default function BouquetPreview({ veilCount, selectedColors, hexFor, hasGysophiles, hasRose, hasChocolats, hasEpingles, hasBillets }: BouquetPreviewProps) {
  const layout = LAYOUTS[veilCount] || [];

  const babyBreathPositions = [
    { x: 85, y: 75 },
    { x: 178, y: 70 },
    { x: 90, y: 130 },
    { x: 175, y: 130 },
    { x: 135, y: 55 },
  ];

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 270 280"
        className="w-full max-w-[260px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f5f0f2" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c9a96e" />
            <stop offset="100%" stopColor="#e0c68a" />
          </linearGradient>
        </defs>

        {/* Wrapping paper */}
        <path
          d="M135 155 L60 250 Q55 258 65 260 L205 260 Q215 258 210 250 Z"
          fill="url(#paperGrad)"
          stroke="#e8dfe3"
          strokeWidth={0.8}
        />
        {/* Gold ribbon trim on paper */}
        <path
          d="M135 155 L62 248"
          fill="none"
          stroke="url(#ribbonGrad)"
          strokeWidth={2}
          opacity={0.6}
        />
        <path
          d="M135 155 L208 248"
          fill="none"
          stroke="url(#ribbonGrad)"
          strokeWidth={2}
          opacity={0.6}
        />

        {/* Paper folds */}
        <path
          d="M80 230 Q90 210 100 225"
          fill="none"
          stroke="#e8dfe3"
          strokeWidth={0.5}
        />
        <path
          d="M170 230 Q180 210 190 225"
          fill="none"
          stroke="#e8dfe3"
          strokeWidth={0.5}
        />

        {/* Paper top wrapping - left and right flaps */}
        <path
          d="M75 140 Q55 100 80 80 Q95 70 100 90 L110 130 Z"
          fill="url(#paperGrad)"
          stroke="#e8dfe3"
          strokeWidth={0.6}
          opacity={0.9}
        />
        <path
          d="M195 140 Q215 100 190 80 Q175 70 170 90 L160 130 Z"
          fill="url(#paperGrad)"
          stroke="#e8dfe3"
          strokeWidth={0.6}
          opacity={0.9}
        />

        {/* Gold edge on flaps */}
        <path
          d="M75 140 Q55 100 80 80 Q95 70 100 90"
          fill="none"
          stroke="url(#ribbonGrad)"
          strokeWidth={1.5}
          opacity={0.5}
        />
        <path
          d="M195 140 Q215 100 190 80 Q175 70 170 90"
          fill="none"
          stroke="url(#ribbonGrad)"
          strokeWidth={1.5}
          opacity={0.5}
        />

        {/* Billets — behind everything, sticking out */}
        {hasBillets && <Billets />}

        {/* Gysophiles (baby's breath) - behind the flowers */}
        {hasGysophiles && <BabyBreath positions={babyBreathPositions} />}

        {/* Epingles — decorative pins between flowers */}
        {hasEpingles && <Epingles />}

        {/* Veil flowers */}
        {layout.map((pos, i) => {
          const colorName = selectedColors[i];
          const hex = colorName ? hexFor(colorName) : "";
          return (
            <VeilFlower
              key={i}
              cx={pos.cx}
              cy={pos.cy}
              r={pos.r}
              color={hex}
              isEmpty={!colorName}
            />
          );
        })}

        {/* White rose eternelle in center */}
        {hasRose && <WhiteRose cx={135} cy={100} />}

        {/* Chocolats — on top, tucked around flowers */}
        {hasChocolats && <Chocolats />}

        {/* Ribbon bow at the gathering point */}
        <ellipse cx={135} cy={158} rx={18} ry={6} fill="url(#ribbonGrad)" opacity={0.7} />
        {/* Ribbon tails */}
        <path d="M125 160 Q115 180 110 195" fill="none" stroke="url(#ribbonGrad)" strokeWidth={2.5} opacity={0.5} />
        <path d="M145 160 Q155 180 160 195" fill="none" stroke="url(#ribbonGrad)" strokeWidth={2.5} opacity={0.5} />

        {/* No veils selected - placeholder text */}
        {veilCount === 0 && (
          <text x="135" y="120" textAnchor="middle" fill="#1A1A1A" fillOpacity={0.2} fontSize={13} fontFamily="sans-serif">
            Choisissez vos voiles
          </text>
        )}
      </svg>
    </div>
  );
}
