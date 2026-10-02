import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  ShoppingBag,
  Utensils,
  Sofa,
  Smartphone,
  Search,
  Sparkles,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Link2,
  Heart,
  Bookmark,
  ChevronRight,
  Loader2,
  Send,
  Star,
  Clock,
  Navigation,
  Menu,
  X,
  Play,
  Plane,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import BoucleChair from "./img/boucle-chair.jpg";
import BrassHanging from "./img/brass-hanging.jpg";
import Cafe from "./img/cafe.jpg";
import Diggin from "./img/diggin.jpg";
import Fashion from "./img/fashion.jpg";
import Food from "./img/food.jpg";
import Gadgets from "./img/gadgets.jpg";
import Home from "./img/home.jpg";
import ManaliRiverCamp from "./img/manali-river-camp.jpg";
import ParatheKiGali from "./img/parathe-ki-gali.jpg";
import Places from "./img/places.jpg";
import Savana from "./img/savana.jpg";
import Udaipur from "./img/udaipur.jpg";

/* ---------------------------------------------------------
   TOKENS
--------------------------------------------------------- */
const C = {
  paper: "#EFE7D4",
  paperDeep: "#E4D9BF",
  cream: "#FBF7EC",
  ink: "#1C1A15",
  inkSoft: "#514C3E",
  pink: "#FF3E7F",
  teal: "#0F8A7A",
  yellow: "#FFC93C",
  indigo: "#3646C4",
  line: "#1C1A15",
};

const displayFont = "'Fraunces', serif";
const bodyFont = "'Space Grotesk', sans-serif";
const monoFont = "'Space Mono', monospace";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

@keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.marquee-left-track { animation: marquee-left linear infinite; }
.marquee-right-track { animation: marquee-right linear infinite; }
.marquee-pause:hover .marquee-left-track,
.marquee-pause:hover .marquee-right-track { animation-play-state: paused; }

@keyframes bubble-float {
  0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
  50% { transform: translateY(-10px) rotate(var(--r, 0deg)); }
}
.bubble-float { animation: bubble-float 4.5s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .marquee-left-track, .marquee-right-track, .bubble-float { animation: none !important; }
}
`;

const dotGrid = {
  backgroundImage: `radial-gradient(${C.ink}22 1.4px, transparent 1.4px)`,
  backgroundSize: "24px 24px",
};

/* Scales decorative stickers down on small screens instead of hiding them */
function useStickerScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 480) setScale(0.42);
      else if (w < 768) setScale(0.58);
      else if (w < 1024) setScale(0.8);
      else setScale(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return scale;
}
// scales a numeric px offset/size by the sticker scale; leaves % strings untouched
const sc = (v, scale) => (typeof v === "number" ? v * scale : v);

/* ---------------------------------------------------------
   MOCK DATA
--------------------------------------------------------- */
const CATEGORIES = [
  { icon: MapPin, label: "Places", color: C.pink, desc: "Address, hours, ratings, nearest metro — no more guessing." },
  { icon: ShoppingBag, label: "Fashion", color: C.indigo, desc: "Brand match, color, material, and where to buy it." },
  { icon: Utensils, label: "Food", color: C.yellow, dark: true, desc: "Dish names, cuisine, price range, nearby alternatives." },
  { icon: Sofa, label: "Home", color: C.teal, desc: "Furniture and décor, plus budget-friendly lookalikes." },
  { icon: Smartphone, label: "Gadgets", color: C.ink, invert: true, desc: "Specs, buying links, and better alternatives." },
];

const STEPS = [
  { n: "01", title: "Paste it", desc: "Drop a Reel, Short, upload, or screenshot — whatever you saved." },
  { n: "02", title: "AI reads it", desc: "Every scene, object, brand, and place gets identified in seconds." },
  { n: "03", title: "You act", desc: "Get the map, the price, the plan — and do the thing, not just save it." },
];

const COLLECTIONS = [
  { label: "Places to Visit", count: 24, color: C.pink, img: Places, h: 220 },
  { label: "Fashion Inspiration", count: 41, color: C.indigo, img: Fashion, h: 160 },
  { label: "Café Wishlist", count: 12, color: C.yellow, dark: true, img: Cafe, h: 190 },
  { label: "Home Inspiration", count: 8, color: C.teal, img: Home, h: 175 },
];

const DISCOVERIES = [
  { img: Diggin, caption: "Diggin, Delhi", sub: "Hauz Khas Village", pin: C.pink },
  { img: Savana, caption: "Savana wrap dress", sub: "Similar to & Other Stories", pin: C.indigo },
  { img: ManaliRiverCamp, caption: "Manali river camp", sub: "Himachal Pradesh", pin: C.teal },
  { img: BrassHanging, caption: "Brass hanging lamp", sub: "Similar to Jaipur bazaar finds", pin: C.yellow },
  { img: ParatheKiGali, caption: "Parathas at Gali Paranthe", sub: "Chandni Chowk", pin: C.pink },
  { img: BoucleChair, caption: "Boucle armchair", sub: "Similar to Pepperfry", pin: C.teal },
];

const PLACE_RESULT = {
  name: "Diggin, Delhi",
  address: "Hauz Khas Village, New Delhi",
  rating: 4.6,
  reviews: 1204,
  hours: "9:00 – 23:00",
  distance: "3.4 km away",
  travel: "12 min drive",
  metro: "Hauz Khas (6 min walk)",
  tags: ["Pet Friendly 🐶", "Great for Work 💻", "Scenic Rooftop 🌅", "Budget Friendly 💰"],
  nearby: ["Cafe Rewind — 3 min walk", "Deer Park — 5 min walk", "Hauz Khas Fort — 6 min walk"],
};

const FASHION_RESULT = [
  { item: "Savana Wrap Dress", match: "Similar to & Other Stories", price: "₹1,899", color: "Sage Green" },
  { item: "Woven Straw Tote", match: "Similar to Fabindia", price: "₹1,200", color: "Natural" },
  { item: "Kolhapuri Sandals", match: "Similar to Fizzy Goblet", price: "₹1,650", color: "Tan" },
];

const CHAT_SEED = [
  { role: "ai", text: "Ask me anything about this discovery — “Is it pet friendly?”, “Find cheaper alternatives”, “Plan a weekend trip.”" },
];

const CANNED_REPLIES = [
  "Diggin is quiet on weekday mornings and gets lively after 6pm — great for a laptop session before noon.",
  "Found 3 dresses under ₹1,500 that match this style closely — check the Fashion tab, sorted by price.",
  "Here's a weekend plan: Day 1 explore Hauz Khas Village and this café, Day 2 Deer Park and the fort ruins nearby.",
];

const SEED_FEEDBACK = [
  { name: "Ananya R.", text: "Found the exact café from a Reel in under a minute — the nearest metro tip saved me so much time.", rating: 5 },
  { name: "Kabir M.", text: "Used it to track down a dress a friend saved. The 'similar products' match was spot on.", rating: 5 },
  { name: "Priya S.", text: "Trip planner around a saved Reel is such a good idea. Would love multi-city support next.", rating: 4 },
];

/* ---------------------------------------------------------
   SMALL PRIMITIVES
--------------------------------------------------------- */

/* Sceniq logo mark — a map pin with a play-triangle, original design */
function LogoMark({ size = 36 }) {
  return (
    <div
      className="rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: C.ink }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 6.1 7.5 12.1 7.5 12.1s7.5-6 7.5-12.1C19.5 5.36 16.14 2 12 2z"
          fill={C.pink}
          stroke={C.cream}
          strokeWidth="0.6"
        />
        <circle cx="12" cy="9.6" r="4.3" fill={C.cream} />
        <path d="M10.6 7.6L14.3 9.6L10.6 11.6V7.6Z" fill={C.ink} />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------
   ORIGINAL STICKER ART
   Hand-drawn SVGs in a coquette / pastel-doodle style — inspired by, but not
   copies of, any reference imagery. Each is self-contained, no external assets.
--------------------------------------------------------- */
const STICKER_ART = {
  heart: (
    <svg viewBox="0 0 64 64">
      <path
        d="M32 54S8 40 8 24c0-8 6-14 13-14 6 0 9 4 11 7 2-3 5-7 11-7 7 0 13 6 13 14 0 16-24 30-24 30z"
        fill={C.pink}
        stroke={C.ink}
        strokeWidth="2.5"
      />
      <path d="M20 20c-2 2-3 5-2 8" stroke={C.cream} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  cherry: (
    <svg viewBox="0 0 64 64">
      <path d="M30 8c4 4 4 10 2 14" stroke={C.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M34 8c-4 4-4 10-2 14" stroke={C.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="42" r="12" fill={C.pink} stroke={C.ink} strokeWidth="2.2" />
      <circle cx="42" cy="40" r="12" fill={C.pink} stroke={C.ink} strokeWidth="2.2" />
      <circle cx="20" cy="37" r="3" fill={C.cream} opacity="0.7" />
      <circle cx="38" cy="35" r="3" fill={C.cream} opacity="0.7" />
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 64 64">
      <path d="M14 26h30v14a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V26z" fill={C.cream} stroke={C.ink} strokeWidth="2.2" />
      <path d="M44 30h4a6 6 0 0 1 0 12h-4" fill="none" stroke={C.ink} strokeWidth="2.2" />
      <path d="M20 22c0-3 3-3 3-6M28 22c0-3 3-3 3-6M36 22c0-3 3-3 3-6" stroke={C.inkSoft} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 64 64">
      <path d="M12 34v-2a20 20 0 0 1 40 0v2" fill="none" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="8" y="32" width="10" height="16" rx="4" fill={C.cream} stroke={C.ink} strokeWidth="2.2" />
      <rect x="46" y="32" width="10" height="16" rx="4" fill={C.indigo} stroke={C.ink} strokeWidth="2.2" />
      <path d="M40 14l6 4-6 4" fill="none" stroke={C.pink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 64 64">
      <rect x="10" y="26" width="44" height="26" fill={C.cream} stroke={C.ink} strokeWidth="2.2" />
      <path d="M8 26l4-12h40l4 12z" fill={C.teal} stroke={C.ink} strokeWidth="2.2" />
      <rect x="26" y="36" width="12" height="16" fill={C.indigo} stroke={C.ink} strokeWidth="2" />
      <path d="M14 32h8M42 32h8" stroke={C.ink} strokeWidth="1.6" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 64 64">
      <path
        d="M32 8l6 16 17 1-13 11 5 17-15-10-15 10 5-17-13-11 17-1z"
        fill={C.indigo}
        stroke={C.ink}
        strokeWidth="2.2"
      />
    </svg>
  ),
  chair: (
    <svg viewBox="0 0 64 64">
      <path d="M16 20c0-6 5-10 16-10s16 4 16 10v18H16V20z" fill={C.pink} stroke={C.ink} strokeWidth="2.2" />
      <rect x="12" y="36" width="40" height="10" rx="3" fill={C.pink} stroke={C.ink} strokeWidth="2.2" />
      <path d="M18 46v8M46 46v8" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  dress: (
    <svg viewBox="0 0 64 64">
      <path d="M20 14c4 4 8 4 12 0" stroke={C.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path
        d="M22 16c-4 2-6 6-4 9l6-2v25c0 3 3 5 8 5s8-2 8-5V23l6 2c2-3 0-7-4-9"
        fill={C.pink}
        stroke={C.ink}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* Original hand-drawn sticker — floats, hovers, and clicks like the icon stickers */
function StickerArt({ art, top, left, right, bottom, rotate = 0, size = 56, scale = 1, bg = C.cream }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hoverScale = pressed ? 0.88 : hover ? 1.14 : 1;
  const effRotate = hover ? rotate + 10 : rotate;
  const s = sc(size, scale);
  return (
    <div
      className="flex absolute items-center justify-center rounded-full cursor-pointer transition-transform duration-300"
      style={{
        top: sc(top, scale),
        left: sc(left, scale),
        right: sc(right, scale),
        bottom: sc(bottom, scale),
        width: s,
        height: s,
        background: bg,
        border: `2px solid ${C.ink}`,
        padding: s * 0.16,
        transform: `rotate(${effRotate}deg) scale(${hoverScale})`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {STICKER_ART[art]}
    </div>
  );
}

/* Faded, blurred grid of real photos used as a "pinteresty" section backdrop */
function PhotoBackdrop({ images, opacity = 0.22, cols = "grid-cols-3 md:grid-cols-6" }) {
  return (
    <>
      <div
        className={`absolute inset-0 -z-10 grid ${cols}`}
        style={{ opacity, filter: "blur(3px) saturate(1.1)" }}
        aria-hidden="true"
      >
        {images.map((image) => (
          <img key={image} src={image} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
      <div
        className="absolute inset-0 -z-10"
        style={{ background: `linear-gradient(${C.paper}cc, ${C.paper}f2 60%, ${C.paper})` }}
        aria-hidden="true"
      />
    </>
  );
}

function Sticker({ children, rotate = 0, style, className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${className}`}
      style={{
        borderColor: C.ink,
        background: C.cream,
        transform: `rotate(${rotate}deg)`,
        fontFamily: monoFont,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PillButton({ children, onClick, primary, style, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 ${className}`}
      style={{
        fontFamily: bodyFont,
        background: primary ? C.indigo : C.cream,
        color: primary ? C.cream : C.ink,
        border: `2px solid ${C.ink}`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Polaroid({ img, caption, rotate, top, left, right, pin = C.pink, tape, scale: deviceScale = 1, className = "" }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hoverScale = pressed ? 0.97 : hover ? 1.06 : 1;
  const effRotate = hover ? 0 : rotate;
  const w = sc(140, deviceScale);
  return (
    <div
      className={`flex absolute flex-col items-center rounded-sm cursor-pointer transition-transform duration-300 ${className}`}
      style={{
        top: sc(top, deviceScale),
        left: sc(left, deviceScale),
        right: sc(right, deviceScale),
        padding: sc(12, deviceScale),
        paddingBottom: sc(16, deviceScale),
        background: C.cream,
        border: `2px solid ${C.ink}`,
        transform: `rotate(${effRotate}deg) scale(${hoverScale})`,
        width: w,
        zIndex: hover ? 30 : 10,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {/* pushpin */}
      <span
        className="absolute rounded-full"
        style={{
          top: -9,
          left: "50%",
          marginLeft: -7,
          width: 14,
          height: 14,
          background: pin,
          border: `2px solid ${C.ink}`,
        }}
      />
      {/* washi tape, optional */}
      {tape && (
        <span
          className="absolute"
          style={{
            top: -14,
            right: -18,
            width: 46,
            height: 20,
            background: tape,
            border: `1px solid ${C.ink}55`,
            opacity: 0.85,
            transform: "rotate(35deg)",
          }}
        />
      )}
      <img
        src={img}
        alt={caption}
        className="w-full object-cover rounded-sm mb-2"
        style={{ height: w * 0.68, border: `1px solid ${C.ink}22` }}
      />
      <span style={{ fontFamily: monoFont, fontSize: Math.max(9, 11 * deviceScale), color: C.ink }}>{caption}</span>
    </div>
  );
}

/* Small floating icon sticker used to scatter across sections — always visible, scales with viewport */
function MiniSticker({ icon: Icon, top, left, right, bottom, rotate = 0, bg = C.cream, size = 44, scale = 1 }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hoverScale = pressed ? 0.85 : hover ? 1.15 : 1;
  const effRotate = hover ? rotate + 18 : rotate;
  const s = sc(size, scale);
  return (
    <div
      className="flex absolute items-center justify-center rounded-full cursor-pointer transition-transform duration-300"
      style={{
        top: sc(top, scale),
        left: sc(left, scale),
        right: sc(right, scale),
        bottom: sc(bottom, scale),
        width: s,
        height: s,
        background: bg,
        border: `2px solid ${C.ink}`,
        transform: `rotate(${effRotate}deg) scale(${hoverScale})`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <Icon size={s * 0.42} color={C.ink} />
    </div>
  );
}

/* A strip of washi tape, standalone, for decorating card edges */
function Tape({ top, left, right, bottom, rotate = 0, color = C.yellow, width = 70, scale = 1 }) {
  return (
    <span
      className="block absolute"
      style={{
        top: sc(top, scale),
        left: sc(left, scale),
        right: sc(right, scale),
        bottom: sc(bottom, scale),
        width: sc(width, scale),
        height: sc(22, scale),
        background: color,
        opacity: 0.8,
        border: `1px solid ${C.ink}44`,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

/* Circular spinning badge, echoing the scrapbook "sticker" motif */
function CircleBadge({ text, top, left, right, bottom, rotate = 0, scale = 1 }) {
  const id = "circlePath-" + text.replace(/\s+/g, "").slice(0, 6);
  const d = Math.max(64, 128 * scale);
  return (
    <div
      className="flex absolute items-center justify-center"
      style={{ top: sc(top, scale), left: sc(left, scale), right: sc(right, scale), bottom: sc(bottom, scale), width: d, height: d, transform: `rotate(${rotate}deg)` }}
    >
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .sceniq-spin { animation: spin-slow 14s linear infinite; transform-origin: 50% 50%; }
        @media (prefers-reduced-motion: reduce) { .sceniq-spin { animation: none; } }
      `}</style>
      <svg viewBox="0 0 128 128" width={d} height={d} className="sceniq-spin">
        <defs>
          <path id={id} d="M 64,64 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" />
        </defs>
        <circle cx="64" cy="64" r="62" fill={C.yellow} stroke={C.ink} strokeWidth="2" />
        <text fontFamily={monoFont} fontSize="9.5" fontWeight="700" letterSpacing="1.5" fill={C.ink}>
          <textPath href={`#${id}`} startOffset="0%">
            {text} • {text} •
          </textPath>
        </text>
      </svg>
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{ width: d * 0.36, height: d * 0.36, background: C.ink }}
      >
        <Sparkles size={d * 0.16} color={C.yellow} />
      </div>
    </div>
  );
}

/* In-flow photo card for the "recently discovered" gallery strip — visible on every screen size */
function GalleryCard({ img, caption, sub, pin = C.pink, rotate = 0 }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const scale = pressed ? 0.97 : hover ? 1.05 : 1;
  const effRotate = hover ? 0 : rotate;
  return (
    <div
      className="relative flex-shrink-0 flex flex-col items-center p-3 pb-4 rounded-sm cursor-pointer transition-transform duration-300"
      style={{
        background: C.cream,
        border: `2px solid ${C.ink}`,
        transform: `rotate(${effRotate}deg) scale(${scale})`,
        width: 152,
        zIndex: hover ? 20 : 1,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <span
        className="absolute rounded-full"
        style={{
          top: -9,
          left: "50%",
          marginLeft: -7,
          width: 14,
          height: 14,
          background: pin,
          border: `2px solid ${C.ink}`,
        }}
      />
      <img
        src={img}
        alt={caption}
        className="w-full h-28 object-cover rounded-sm mb-3"
        style={{ border: `1px solid ${C.ink}22` }}
      />
      <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 13, color: C.ink }}>{caption}</span>
      <span style={{ fontFamily: monoFont, fontSize: 10, color: C.inkSoft }} className="mt-0.5">
        {sub}
      </span>
    </div>
  );
}

/* Process step card — straightens and lifts on hover */
function StepCard({ step, rotate = 0 }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const scale = pressed ? 0.98 : hover ? 1.03 : 1;
  const effRotate = hover ? 0 : rotate;
  return (
    <div
      className="p-6 rounded-2xl cursor-pointer transition-transform duration-300"
      style={{
        background: C.cream,
        border: `2px solid ${C.ink}`,
        transform: `rotate(${effRotate}deg) translateY(${hover ? -4 : 0}px) scale(${scale})`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <span style={{ fontFamily: displayFont, fontSize: 40, color: C.indigo }}>{step.n}</span>
      <h3 style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 20 }} className="mt-2 mb-2">
        {step.title}
      </h3>
      <p style={{ fontFamily: bodyFont, color: C.inkSoft, fontSize: 14 }}>{step.desc}</p>
    </div>
  );
}

/* Floating Instagram-style comment bubble used in the Problem section */
function CommentBubble({ text, top, left, right, bottom, rotate = 0, delay = 0, unread, scale = 1 }) {
  return (
    <div
      className="block absolute bubble-float"
      style={{ top: sc(top, scale), left: sc(left, scale), right: sc(right, scale), bottom: sc(bottom, scale), "--r": `${rotate}deg`, animationDelay: `${delay}s`, zIndex: 25 }}
    >
      <div
        className="flex items-center gap-2 rounded-2xl"
        style={{ background: C.cream, border: `2px solid ${C.ink}`, maxWidth: sc(190, scale), padding: `${sc(8, scale)}px ${sc(16, scale)}px` }}
      >
        <span style={{ fontFamily: bodyFont, fontSize: Math.max(10, 13 * scale), fontWeight: 600 }}>{text}</span>
      </div>
      {unread && (
        <span
          style={{
            fontFamily: monoFont,
            fontSize: Math.max(8, 10 * scale),
            color: C.inkSoft,
            background: C.paper,
            border: `1px solid ${C.ink}33`,
          }}
          className="inline-block mt-1 ml-2 px-2 py-0.5 rounded-full"
        >
          seen · no reply
        </span>
      )}
    </div>
  );
}

/* Feedback wall card — fixed width so it works cleanly inside the marquee */
/* Pinterest-style collection tile with a real cover photo and staggered height */
function CollectionCard({ c }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const scale = pressed ? 0.97 : hover ? 1.03 : 1;
  return (
    <div
      className="mb-4 break-inside-avoid rounded-xl overflow-hidden cursor-pointer transition-transform duration-300"
      style={{ border: `2px solid ${c.color}`, transform: `scale(${scale})` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <img src={c.img} alt={c.label} className="w-full object-cover" style={{ height: c.h }} />
      <div className="p-4" style={{ background: C.paper, color: C.ink }}>
        <Bookmark size={16} color={c.color} className="mb-2" />
        <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 14 }}>{c.label}</p>
        <p style={{ fontFamily: monoFont, fontSize: 12, color: C.inkSoft }}>{c.count} saved</p>
      </div>
    </div>
  );
}

function FeedbackCard({ f, rotate = 0 }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const scale = pressed ? 0.97 : hover ? 1.03 : 1;
  const effRotate = hover ? 0 : rotate;
  return (
    <div
      className="flex-shrink-0 rounded-2xl p-5 cursor-pointer transition-transform duration-300"
      style={{
        background: C.cream,
        border: `2px solid ${C.ink}`,
        transform: `rotate(${effRotate}deg) scale(${scale})`,
        width: 280,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} size={13} fill={s < f.rating ? C.yellow : "none"} color={C.ink} />
        ))}
      </div>
      <p style={{ fontFamily: bodyFont, fontSize: 14 }} className="mb-3">
        “{f.text}”
      </p>
      <p style={{ fontFamily: monoFont, fontSize: 12, color: C.inkSoft }}>— {f.name}</p>
    </div>
  );
}

/* Circular social icon button — lifts and tilts on hover, presses on click */
function SocialIcon({ icon: Icon, href = "#" }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const scale = pressed ? 0.9 : hover ? 1.12 : 1;
  const rotate = hover ? -8 : 0;
  return (
    <a
      href={href}
      className="flex items-center justify-center rounded-full transition-transform duration-200"
      style={{
        width: 38,
        height: 38,
        background: hover ? C.ink : C.cream,
        border: `2px solid ${C.ink}`,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <Icon size={16} color={hover ? C.cream : C.ink} />
    </a>
  );
}

/* ---------------------------------------------------------
   LANDING PAGE
--------------------------------------------------------- */
function Landing({ goToApp }) {
  const howRef = useRef(null);
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: "smooth" });
  const stkScale = useStickerScale();

  const [feedback, setFeedback] = useState(SEED_FEEDBACK);
  const [fbName, setFbName] = useState("");
  const [fbText, setFbText] = useState("");
  const [fbRating, setFbRating] = useState(5);

  const submitFeedback = (e) => {
    e.preventDefault();
    if (!fbText.trim()) return;
    setFeedback((prev) => [
      { name: fbName.trim() || "Anonymous", text: fbText.trim(), rating: fbRating },
      ...prev,
    ]);
    setFbName("");
    setFbText("");
    setFbRating(5);
  };

  return (
    <div className="relative" style={{ background: C.paper, ...dotGrid }}>
      {/* corner torn-paper decorations */}
      <div
        className="block absolute -z-0"
        style={{
          width: 160 * stkScale,
          height: 96 * stkScale,
          top: -20 * stkScale,
          left: -30 * stkScale,
          background: C.pink,
          border: `2px solid ${C.ink}`,
          transform: "rotate(-6deg)",
        }}
      />
      <div
        className="block absolute -z-0"
        style={{
          width: 144 * stkScale,
          height: 80 * stkScale,
          top: -10 * stkScale,
          right: -20 * stkScale,
          background: C.yellow,
          border: `2px solid ${C.ink}`,
          transform: "rotate(6deg)",
        }}
      />
      <MiniSticker icon={Star} top={120} left={40} rotate={-8} bg={C.yellow} size={38} scale={stkScale} />
      <MiniSticker icon={Plane} top={90} right={60} rotate={14} bg={C.teal} size={40} scale={stkScale} />
      <Tape top={4} left={"38%"} rotate={-4} color={C.pink} width={64} scale={stkScale} />

      {/* NAV */}
      <nav className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <LogoMark size={36} />
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 22 }}>Sceniq</span>
        </div>
        <div
          className="hidden md:flex items-center gap-8"
          style={{ fontFamily: bodyFont, fontSize: 15, color: C.inkSoft }}
        >
          <a href="#features" className="hover:text-black">Features</a>
          <button onClick={scrollToHow} className="hover:text-black">How it works</button>
          <a href="#feedback" className="hover:text-black">Feedback</a>
        </div>
        <PillButton primary onClick={goToApp} style={{ padding: "10px 20px" }}>
          Try it free <ArrowRight size={16} />
        </PillButton>
      </nav>

      {/* HERO */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-32 text-center overflow-hidden">
          <PhotoBackdrop images={[Diggin, Savana, Udaipur, ManaliRiverCamp, BrassHanging, ParatheKiGali]} opacity={0.25} />

        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <Sticker rotate={-3}>
            <Star size={14} fill={C.yellow} color={C.ink} />
            <span style={{ fontSize: 12, fontWeight: 700 }}>#1 SAVED-TO-DONE APP</span>
          </Sticker>
          <Sticker rotate={2}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>WORKS ON REELS, SHORTS &amp; SCREENSHOTS</span>
          </Sticker>
        </div>

        <h1
          style={{ fontFamily: displayFont, fontWeight: 600, lineHeight: 1.05, color: C.ink }}
          className="text-5xl md:text-7xl mb-3"
        >
          Turn every scroll into
        </h1>
        <h1
          style={{ fontFamily: displayFont, fontWeight: 300, fontStyle: "italic", lineHeight: 1.05, color: C.indigo }}
          className="text-5xl md:text-7xl mb-5"
        >
          a real experience.
        </h1>
        <p
          style={{ fontFamily: monoFont, fontSize: 13, color: C.inkSoft }}
          className="mb-8"
        >
          Every reel has a story. Discover yours.
        </p>

        <p
          className="max-w-xl mx-auto mb-10 text-lg"
          style={{ fontFamily: bodyFont, color: C.inkSoft }}
        >
          Paste any Reel, Short, or screenshot. Sceniq finds the café, the dress,
          the destination — and tells you exactly how to get it.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
          <PillButton primary onClick={goToApp}>
            Paste a link — it's free <ArrowRight size={16} />
          </PillButton>
          <PillButton onClick={scrollToHow}>
            See how it works <ArrowDown size={16} />
          </PillButton>
        </div>

        {/* APP MOCKUP */}
        <div className="relative mt-20 max-w-2xl mx-auto">
          <Polaroid img={Udaipur} caption="Udaipur, Rajasthan" rotate={-10} top={-40} left={-170} pin={C.teal} tape={C.yellow} scale={stkScale} />
          <Polaroid img={Savana} caption="Savana wrap dress" rotate={9} top={-10} right={-190} pin={C.indigo} scale={stkScale} />
          <Polaroid img={Diggin} caption="Diggin, Delhi" rotate={7} top={210} left={-200} pin={C.pink} tape={C.teal} scale={stkScale} />
          <CircleBadge text="PASTE · ANALYZE · DISCOVER" top={230} right={-160} rotate={-6} scale={stkScale} />
          <StickerArt art="heart" top={-70} left={30} rotate={-12} bg={C.pink} scale={stkScale} />
          <StickerArt art="coffee" bottom={-30} right={40} rotate={10} bg={C.cream} scale={stkScale} />
          <StickerArt art="star" top={90} right={-90} rotate={14} bg={C.yellow} size={48} scale={stkScale} />
          <Tape top={-24} left={200} rotate={-8} color={C.teal} width={56} scale={stkScale} />

          <div
            className="relative rounded-2xl overflow-hidden text-left"
            style={{ border: `2px solid ${C.ink}`, background: C.cream }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ background: C.ink }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: C.pink }} />
              <span className="w-3 h-3 rounded-full" style={{ background: C.yellow }} />
              <span className="w-3 h-3 rounded-full" style={{ background: C.teal }} />
              <span
                className="ml-3 text-xs"
                style={{ fontFamily: monoFont, color: C.paper }}
              >
                sceniq.app
              </span>
            </div>

            <div className="p-6">
              <div
                className="flex items-center gap-3 rounded-full px-4 py-3 mb-5"
                style={{ border: `2px solid ${C.ink}` }}
              >
                <Link2 size={16} />
                <span style={{ fontFamily: monoFont, fontSize: 13, color: C.inkSoft }}>
                  instagram.com/reel/Cx9k2...
                </span>
              </div>

              <div className="flex items-center justify-center mb-5">
                <ArrowDown size={20} color={C.inkSoft} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div
                  className="col-span-1 rounded-lg flex items-center justify-center h-20"
                  style={{ background: C.indigo }}
                >
                  <Play size={22} color={C.cream} fill={C.cream} />
                </div>
                <div className="col-span-2 rounded-lg p-3 text-left" style={{ border: `2px solid ${C.ink}` }}>
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin size={13} color={C.pink} />
                    <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 13 }}>Diggin, Delhi</span>
                  </div>
                  <span style={{ fontFamily: monoFont, fontSize: 11, color: C.inkSoft }}>
                    4.6★ · 12 min drive · Pet friendly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-10 pb-28">
        <PhotoBackdrop images={[Diggin, Savana, Cafe, Food]} opacity={0.1} cols="grid-cols-2 md:grid-cols-4" />
        <Tape top={-6} left={"50%"} rotate={-3} color={C.pink} width={70} scale={stkScale} />
        <StickerArt art="cherry" bottom={-10} right={-6} rotate={10} bg={C.cream} size={50} scale={stkScale} />
        <div className="relative py-6">
          <CommentBubble text="Location?" top={-10} left={-10} rotate={-6} delay={0} scale={stkScale} />
          <CommentBubble text="Link for the dress?" top={30} right={-30} rotate={5} delay={1.2} scale={stkScale} />
          <CommentBubble text="Check your DM." bottom={-70} left={60} rotate={-4} delay={2.1} unread scale={stkScale} />

          <p style={{ fontFamily: monoFont, color: C.inkSoft, fontSize: 13 }} className="mb-3 text-center">
            — SOUND FAMILIAR? —
          </p>
          <h2
            style={{ fontFamily: displayFont, fontWeight: 600 }}
            className="text-3xl md:text-5xl text-center mb-6 max-w-2xl mx-auto"
          >
            Every reel has a story. <span style={{ fontStyle: "italic", color: C.indigo }}>Discover yours.</span>
          </h2>
          <p
            style={{ fontFamily: bodyFont, color: C.inkSoft }}
            className="text-center max-w-2xl mx-auto text-lg"
          >
            We've all saved a reel hoping to come back later, only to end up scrolling
            through unanswered comments or waiting for a reply that never arrives —
            reading the same caption again and again, hoping something finally clicks.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howRef} id="how" className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <MiniSticker icon={Link2} top={10} left={-20} rotate={-10} bg={C.cream} size={40} scale={stkScale} />
        <MiniSticker icon={MapPin} bottom={20} right={-10} rotate={12} bg={C.pink} size={42} scale={stkScale} />
        <p style={{ fontFamily: monoFont, color: C.inkSoft, fontSize: 13 }} className="mb-3 text-center">
          — THE PROCESS —
        </p>
        <h2
          style={{ fontFamily: displayFont, fontWeight: 600 }}
          className="text-4xl md:text-5xl text-center mb-16"
        >
          From scroll to done, in three steps
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <StepCard key={s.n} step={s} rotate={i % 2 === 0 ? -1.5 : 1.5} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <PhotoBackdrop images={[Places, Fashion, Food, Home, Gadgets]} opacity={0.1} cols="grid-cols-3 md:grid-cols-5" />
        <MiniSticker icon={Sofa} top={0} right={0} rotate={-9} bg={C.teal} size={42} scale={stkScale} />
        <MiniSticker icon={Utensils} bottom={40} left={-10} rotate={11} bg={C.yellow} size={40} scale={stkScale} />
        <StickerArt art="shop" top={60} left={10} rotate={-6} bg={C.cream} size={48} scale={stkScale} />
        <p style={{ fontFamily: monoFont, color: C.inkSoft, fontSize: 13 }} className="mb-3 text-center">
          — WHAT IT FINDS —
        </p>
        <h2
          style={{ fontFamily: displayFont, fontWeight: 600 }}
          className="text-4xl md:text-5xl text-center mb-16"
        >
          One paste, everything identified
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="group rounded-2xl p-5 cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 active:translate-y-0 active:scale-95"
              style={{ background: C.cream, border: `2px solid ${C.ink}` }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                style={{ background: cat.color }}
              >
                <cat.icon size={20} color={cat.invert || cat.dark ? C.ink : C.cream} />
              </div>
              <h3 style={{ fontFamily: bodyFont, fontWeight: 700 }} className="mb-1">
                {cat.label}
              </h3>
              <p style={{ fontFamily: bodyFont, color: C.inkSoft, fontSize: 13 }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENTLY DISCOVERED GALLERY */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <p style={{ fontFamily: monoFont, color: C.inkSoft, fontSize: 13 }} className="mb-3 text-center">
          — RECENTLY DISCOVERED —
        </p>
        <h2
          style={{ fontFamily: displayFont, fontWeight: 600 }}
          className="text-3xl md:text-4xl text-center mb-12"
        >
          Pulled straight out of people's reels
        </h2>
        <div className="marquee-pause overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
          <div className="flex gap-6 w-max marquee-left-track" style={{ animationDuration: "28s" }}>
            {[...DISCOVERIES, ...DISCOVERIES].map((d, i) => (
              <GalleryCard key={`${d.caption}-${i}`} {...d} rotate={i % 2 === 0 ? -4 : 4} />
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <MiniSticker icon={Bookmark} top={40} left={-6} rotate={-10} bg={C.pink} size={40} scale={stkScale} />
        <Tape top={22} right={"18%"} rotate={6} color={C.yellow} width={60} scale={stkScale} />
        <StickerArt art="chair" bottom={-16} left={-14} rotate={-8} bg={C.cream} size={54} scale={stkScale} />
        <div
          className="rounded-3xl p-10 md:p-14"
          style={{ background: C.ink, color: C.cream }}
        >
          <p style={{ color: C.yellow, fontFamily: monoFont, fontSize: 13 }} className="mb-3">
            — SMART COLLECTIONS —
          </p>
          <h2 style={{ fontFamily: displayFont, fontWeight: 600 }} className="text-3xl md:text-4xl mb-10 max-w-lg">
            Not another messy "Saved" folder.
          </h2>
          {/* pinteresty masonry grid — real cover photos, staggered heights */}
          <div className="columns-2 md:columns-4 gap-4 [column-fill:_balance]">
            {COLLECTIONS.map((c, i) => (
              <CollectionCard key={c.label} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section id="feedback" className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <PhotoBackdrop images={[Cafe, Diggin, Savana]} opacity={0.1} cols="grid-cols-3" />
        <StickerArt art="dress" top={10} right={-10} rotate={8} bg={C.cream} size={50} scale={stkScale} />
        <p style={{ fontFamily: monoFont, color: C.inkSoft, fontSize: 13 }} className="mb-3 text-center">
          — TELL US SOMETHING —
        </p>
        <h2
          style={{ fontFamily: displayFont, fontWeight: 600 }}
          className="text-4xl md:text-5xl text-center mb-4"
        >
          What people are saying
        </h2>
        <p style={{ fontFamily: bodyFont, color: C.inkSoft }} className="text-center mb-12">
          Leave your own note below — it shows up on this wall right away.
        </p>

        {/* form */}
        <form
          onSubmit={submitFeedback}
          className="rounded-2xl p-6 mb-12"
          style={{ background: C.cream, border: `2px solid ${C.ink}` }}
        >
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input
              value={fbName}
              onChange={(e) => setFbName(e.target.value)}
              placeholder="Your name (optional)"
              className="rounded-full px-4 py-3 outline-none"
              style={{ border: `2px solid ${C.ink}`, fontFamily: bodyFont, fontSize: 14, background: C.cream }}
            />
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setFbRating(n)}
                  aria-label={`Rate ${n} stars`}
                  className="p-1"
                >
                  <Star size={20} fill={n <= fbRating ? C.yellow : "none"} color={C.ink} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={fbText}
            onChange={(e) => setFbText(e.target.value)}
            placeholder="What worked, what didn't, what you'd love to see next…"
            rows={3}
            className="w-full rounded-2xl px-4 py-3 outline-none mb-4 resize-none"
            style={{ border: `2px solid ${C.ink}`, fontFamily: bodyFont, fontSize: 14, background: C.cream }}
          />
          <PillButton primary style={{ padding: "12px 24px" }}>
            Post feedback <Send size={15} />
          </PillButton>
        </form>

        {/* wall */}
        <div className="marquee-pause overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
          <div className="flex gap-4 w-max marquee-right-track" style={{ animationDuration: "32s" }}>
            {[...feedback, ...feedback].map((f, i) => (
              <FeedbackCard key={i} f={f} rotate={i % 2 === 0 ? -1 : 1} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32 text-center">
        <PhotoBackdrop images={[Udaipur, ManaliRiverCamp]} opacity={0.12} cols="grid-cols-2" />
        <MiniSticker icon={Heart} top={-10} left={20} rotate={-12} bg={C.pink} size={38} scale={stkScale} />
        <MiniSticker icon={Sparkles} top={20} right={10} rotate={14} bg={C.yellow} size={40} scale={stkScale} />
        <StickerArt art="headphones" bottom={0} left={-16} rotate={-8} bg={C.cream} size={50} scale={stkScale} />
        <h2
          style={{ fontFamily: displayFont, fontWeight: 600 }}
          className="text-4xl md:text-6xl mb-8"
        >
          Stop screenshotting. <br /> Start doing.
        </h2>
        <PillButton primary onClick={goToApp} style={{ padding: "16px 32px", fontSize: 17 }}>
          Try Sceniq free <ArrowRight size={18} />
        </PillButton>
      </section>

      <footer
        className="relative z-10 border-t-2 py-8 px-6"
        style={{ borderColor: C.ink }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={28} />
            <span style={{ fontFamily: displayFont, fontWeight: 700 }}>Sceniq</span>
          </div>
          <span style={{ fontFamily: monoFont, fontSize: 12, color: C.inkSoft }}>
            Turn every scroll into a real experience.
          </span>
          <div className="flex items-center gap-3">
            <SocialIcon icon={Instagram} />
            <SocialIcon icon={Facebook} />
            <SocialIcon icon={Youtube} />
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------
   APP SHELL
--------------------------------------------------------- */
function AppShell({ goToLanding }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | analyzing | done
  const [tab, setTab] = useState("place");
  const [chatLog, setChatLog] = useState(CHAT_SEED);
  const [chatInput, setChatInput] = useState("");

  const analyze = () => {
    if (!url.trim()) return;
    setStatus("analyzing");
    setTimeout(() => setStatus("done"), 1600);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", text: chatInput };
    const reply = { role: "ai", text: CANNED_REPLIES[chatLog.length % CANNED_REPLIES.length] };
    setChatLog((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => setChatLog((prev) => [...prev, reply]), 700);
  };

  const TABS = [
    { id: "place", label: "Place", icon: MapPin },
    { id: "fashion", label: "Fashion", icon: ShoppingBag },
    { id: "insights", label: "AI Insights", icon: Sparkles },
    { id: "ask", label: "Ask AI", icon: Send },
  ];

  const stkScale = useStickerScale();

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: C.paper, ...dotGrid }}>
      <PhotoBackdrop images={[Diggin, Savana, ManaliRiverCamp, Cafe]} opacity={0.12} cols="grid-cols-2 md:grid-cols-4" />
      <StickerArt art="star" top={70} left={20} rotate={-10} bg={C.yellow} size={46} scale={stkScale} />
      <StickerArt art="cherry" top={40} right={30} rotate={8} bg={C.cream} size={50} scale={stkScale} />
      <StickerArt art="heart" bottom={60} left={40} rotate={-6} bg={C.pink} size={44} scale={stkScale} />
      <Tape top={0} right={"22%"} rotate={-5} color={C.teal} width={60} scale={stkScale} />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b-2" style={{ borderColor: C.ink }}>
        <button onClick={goToLanding} className="flex items-center gap-2" style={{ fontFamily: bodyFont }}>
          <LogoMark size={32} />
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 18 }}>Sceniq</span>
        </button>
        <button
          onClick={goToLanding}
          className="text-sm flex items-center gap-1"
          style={{ fontFamily: bodyFont, color: C.inkSoft }}
        >
          ← Back to site
        </button>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* paste bar */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: C.cream, border: `2px solid ${C.ink}` }}
        >
          <p style={{ fontFamily: monoFont, fontSize: 12, color: C.inkSoft }} className="mb-3">
            PASTE A REEL, SHORT, OR SCREENSHOT
          </p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div
              className="flex-1 flex items-center gap-2 rounded-full px-4 py-3"
              style={{ border: `2px solid ${C.ink}` }}
            >
              <Link2 size={16} color={C.inkSoft} />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://instagram.com/reel/..."
                className="flex-1 bg-transparent outline-none"
                style={{ fontFamily: monoFont, fontSize: 13 }}
              />
            </div>
            <PillButton primary onClick={analyze} style={{ padding: "12px 24px" }}>
              {status === "analyzing" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Analyze
            </PillButton>
          </div>
        </div>

        {status === "idle" && (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ border: `2px dashed ${C.ink}66` }}
          >
            <p style={{ fontFamily: bodyFont, color: C.inkSoft }}>
              Paste a link above to see places, fashion, and AI insights appear here.
            </p>
          </div>
        )}

        {status === "analyzing" && (
          <div className="rounded-2xl p-10 text-center" style={{ border: `2px solid ${C.ink}`, background: C.cream }}>
            <Loader2 className="animate-spin mx-auto mb-3" size={26} />
            <p style={{ fontFamily: monoFont, fontSize: 13, color: C.inkSoft }}>
              Reading scenes, matching places, finding products…
            </p>
          </div>
        )}

        {status === "done" && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* source panel */}
            <div className="md:col-span-1">
              <div
                className="rounded-2xl overflow-hidden mb-4"
                style={{ border: `2px solid ${C.ink}` }}
              >
                <div className="h-40 flex items-center justify-center" style={{ background: C.indigo }}>
                  <Play size={30} color={C.cream} fill={C.cream} />
                </div>
                <div className="p-4" style={{ background: C.cream }}>
                  <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 14 }} className="mb-2">
                    Detected in this reel
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Café", "Dress", "Tote bag", "Sandals"].map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ border: `1px solid ${C.ink}`, fontFamily: monoFont }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full"
                style={{ border: `2px solid ${C.ink}`, fontFamily: bodyFont, fontWeight: 600 }}
              >
                <Bookmark size={15} /> Save to collection
              </button>
            </div>

            {/* tabs panel */}
            <div className="md:col-span-2">
              <div className="flex gap-2 mb-4 flex-wrap">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm"
                    style={{
                      fontFamily: bodyFont,
                      border: `2px solid ${C.ink}`,
                      background: tab === t.id ? C.ink : "transparent",
                      color: tab === t.id ? C.cream : C.ink,
                    }}
                  >
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ background: C.cream, border: `2px solid ${C.ink}` }}
              >
                {tab === "place" && (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 600 }}>
                          {PLACE_RESULT.name}
                        </h3>
                        <p style={{ fontFamily: bodyFont, color: C.inkSoft, fontSize: 13 }}>
                          {PLACE_RESULT.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-1" style={{ fontFamily: bodyFont, fontWeight: 700 }}>
                        <Star size={15} fill={C.yellow} color={C.ink} /> {PLACE_RESULT.rating}
                        <span style={{ color: C.inkSoft, fontWeight: 400 }}>({PLACE_RESULT.reviews})</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm" style={{ fontFamily: bodyFont }}>
                      <div className="flex items-center gap-1"><Clock size={14} /> {PLACE_RESULT.hours}</div>
                      <div className="flex items-center gap-1"><Navigation size={14} /> {PLACE_RESULT.distance}</div>
                      <div className="flex items-center gap-1"><MapPin size={14} /> {PLACE_RESULT.metro}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {PLACE_RESULT.tags.map((tg) => (
                        <span
                          key={tg}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ background: C.paper, border: `1px solid ${C.ink}`, fontFamily: monoFont }}
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 13 }} className="mb-2">
                      Nearby
                    </p>
                    <ul style={{ fontFamily: bodyFont, fontSize: 13, color: C.inkSoft }} className="space-y-1">
                      {PLACE_RESULT.nearby.map((n) => (
                        <li key={n} className="flex items-center gap-2">
                          <ChevronRight size={13} /> {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === "fashion" && (
                  <div className="space-y-3">
                    {FASHION_RESULT.map((f) => (
                      <div
                        key={f.item}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ border: `1px solid ${C.ink}` }}
                      >
                        <div>
                          <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 14 }}>{f.item}</p>
                          <p style={{ fontFamily: monoFont, fontSize: 12, color: C.inkSoft }}>
                            {f.match} · {f.color}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ fontFamily: bodyFont, fontWeight: 700 }}>{f.price}</span>
                          <Heart size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "insights" && (
                  <div className="flex flex-wrap gap-3">
                    {PLACE_RESULT.tags.map((tg, i) => (
                      <div
                        key={tg}
                        className="px-4 py-3 rounded-xl text-sm"
                        style={{
                          fontFamily: bodyFont,
                          fontWeight: 600,
                          background: [C.pink, C.teal, C.yellow, C.indigo][i % 4],
                          color: [C.yellow].includes([C.pink, C.teal, C.yellow, C.indigo][i % 4]) ? C.ink : C.cream,
                        }}
                      >
                        {tg}
                      </div>
                    ))}
                  </div>
                )}

                {tab === "ask" && (
                  <div className="flex flex-col h-72">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
                      {chatLog.map((m, i) => (
                        <div
                          key={i}
                          className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === "user" ? "ml-auto" : ""}`}
                          style={{
                            fontFamily: bodyFont,
                            background: m.role === "user" ? C.indigo : C.paper,
                            color: m.role === "user" ? C.cream : C.ink,
                            border: m.role === "user" ? "none" : `1px solid ${C.ink}`,
                          }}
                        >
                          {m.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendChat()}
                        placeholder="Is this place worth visiting in December?"
                        className="flex-1 rounded-full px-4 py-2 outline-none"
                        style={{ border: `1px solid ${C.ink}`, fontFamily: bodyFont, fontSize: 13 }}
                      />
                      <button
                        onClick={sendChat}
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: C.ink }}
                      >
                        <Send size={15} color={C.cream} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ROOT
--------------------------------------------------------- */
export default function Sceniq() {
  const [view, setView] = useState("landing"); // landing | app

  return (
    <div style={{ fontFamily: bodyFont, color: C.ink }}>
      <style>{FONT_IMPORT}</style>
      {view === "landing" ? (
        <Landing goToApp={() => setView("app")} />
      ) : (
        <AppShell goToLanding={() => setView("landing")} />
      )}
    </div>
  );
}
