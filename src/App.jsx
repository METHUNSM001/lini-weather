/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║          LINI_TECH — AI Weather Intelligence Platform        ║
 * ║  OpenWeather • Groq LLaMA • City Images • Live Charts        ║
 * ║  All keys pre-configured — works out of the box ✅           ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, RadarChart,
  Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import {
  Search, Wind, Droplets, Eye, Gauge, MapPin, Star,
  X, Send, Bot, RefreshCw, AlertTriangle, Thermometer,
  Sun, Moon, ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────
//  🔑  PRE-CONFIGURED API KEYS
// ─────────────────────────────────────────────────────────────────────
const OW_KEY   = import.meta.env.VITE_OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY";
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY";

// ─────────────────────────────────────────────────────────────────────
//  🏙️  MAJOR CITY BACKGROUND IMAGE MAP  (Unsplash CDN — no key needed)
// ─────────────────────────────────────────────────────────────────────
const CITY_IMAGES = {
  // Europe
  "london":       "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80",
  "paris":        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80",
  "rome":         "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1920&q=80",
  "barcelona":    "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1920&q=80",
  "amsterdam":    "https://images.unsplash.com/photo-1534351590666-13e3e96b5702?auto=format&fit=crop&w=1920&q=80",
  "berlin":       "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1920&q=80",
  "madrid":       "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1920&q=80",
  "vienna":       "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1920&q=80",
  "prague":       "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1920&q=80",
  "budapest":     "https://images.unsplash.com/photo-1570639565131-7a5e56e9e86a?auto=format&fit=crop&w=1920&q=80",
  "lisbon":       "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=1920&q=80",
  "athens":       "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1920&q=80",
  "moscow":       "https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&w=1920&q=80",
  "stockholm":    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1920&q=80",
  "oslo":         "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1920&q=80",
  "copenhagen":   "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1920&q=80",
  "zürich":       "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1920&q=80",
  "zurich":       "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1920&q=80",
  "brussels":     "https://images.unsplash.com/photo-1559113513-d5bc0e9a5f2e?auto=format&fit=crop&w=1920&q=80",
  "warsaw":       "https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1920&q=80",

  // Middle East & Africa
  "dubai":        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",
  "abu dhabi":    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",
  "istanbul":     "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1920&q=80",
  "cairo":        "https://images.unsplash.com/photo-1539650116574-75c0c6c31571?auto=format&fit=crop&w=1920&q=80",
  "riyadh":       "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1920&q=80",
  "doha":         "https://images.unsplash.com/photo-1597949952185-e0b6c8d0c79a?auto=format&fit=crop&w=1920&q=80",
  "nairobi":      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=1920&q=80",
  "cape town":    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1920&q=80",
  "casablanca":   "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1920&q=80",
  "lagos":        "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&w=1920&q=80",

  // Asia
  "tokyo":        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80",
  "beijing":      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1920&q=80",
  "shanghai":     "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=1920&q=80",
  "singapore":    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1920&q=80",
  "hong kong":    "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1920&q=80",
  "seoul":        "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1920&q=80",
  "bangkok":      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1920&q=80",
  "mumbai":       "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1920&q=80",
  "delhi":        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=80",
  "new delhi":    "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=80",
  "kolkata":      "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1920&q=80",
  "bangalore":    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1920&q=80",
  "chennai":      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80",
  "coimbatore":   "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80",
  "hyderabad":    "https://images.unsplash.com/photo-1572026820169-2f87c2e3d68e?auto=format&fit=crop&w=1920&q=80",
  "kuala lumpur": "https://images.unsplash.com/photo-1596422846543-75c6fc197f11?auto=format&fit=crop&w=1920&q=80",
  "jakarta":      "https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1920&q=80",
  "taipei":       "https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1920&q=80",
  "osaka":        "https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?auto=format&fit=crop&w=1920&q=80",
  "kyoto":        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80",
  "karachi":      "https://images.unsplash.com/photo-1563302111-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80",
  "dhaka":        "https://images.unsplash.com/photo-1563302111-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80",
  "colombo":      "https://images.unsplash.com/photo-1545156521-77bd85671d30?auto=format&fit=crop&w=1920&q=80",
  "kathmandu":    "https://images.unsplash.com/photo-1582654454409-778f6be27e35?auto=format&fit=crop&w=1920&q=80",

  // Americas
  "new york":     "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&q=80",
  "los angeles":  "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?auto=format&fit=crop&w=1920&q=80",
  "chicago":      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80",
  "san francisco":"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80",
  "miami":        "https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=1920&q=80",
  "las vegas":    "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1920&q=80",
  "toronto":      "https://images.unsplash.com/photo-1517090186835-e348b621c9ca?auto=format&fit=crop&w=1920&q=80",
  "vancouver":    "https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1920&q=80",
  "montreal":     "https://images.unsplash.com/photo-1538326260047-3d0a5f91a659?auto=format&fit=crop&w=1920&q=80",
  "mexico city":  "https://images.unsplash.com/photo-1576177765665-a98d5ee6d4a1?auto=format&fit=crop&w=1920&q=80",
  "sao paulo":    "https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?auto=format&fit=crop&w=1920&q=80",
  "rio de janeiro":"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1920&q=80",
  "buenos aires": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1920&q=80",
  "lima":         "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?auto=format&fit=crop&w=1920&q=80",
  "bogota":       "https://images.unsplash.com/photo-1568967730286-67bd2d2a87e7?auto=format&fit=crop&w=1920&q=80",
  "santiago":     "https://images.unsplash.com/photo-1510432390543-e2c07c7eb8d4?auto=format&fit=crop&w=1920&q=80",
  "seattle":      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&q=80",
  "boston":       "https://images.unsplash.com/photo-1501979376754-f0869df70af6?auto=format&fit=crop&w=1920&q=80",
  "washington":   "https://images.unsplash.com/photo-1617581629397-a72507c3de9e?auto=format&fit=crop&w=1920&q=80",

  // Oceania
  "sydney":       "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1920&q=80",
  "melbourne":    "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1920&q=80",
  "auckland":     "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1920&q=80",
  "brisbane":     "https://images.unsplash.com/photo-1566734904496-9309bb1798ae?auto=format&fit=crop&w=1920&q=80",
};

// Weather-condition fallback images
const WEATHER_IMAGES = {
  Clear:        "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80",
  Clouds:       "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80",
  Rain:         "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920&q=80",
  Drizzle:      "https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&w=1920&q=80",
  Thunderstorm: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1920&q=80",
  Snow:         "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80",
  Mist:         "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=80",
  Fog:          "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=80",
  Haze:         "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=80",
  default:      "https://images.unsplash.com/photo-1532178910-7815d6919875?auto=format&fit=crop&w=1920&q=80",
};

function getCityImage(cityName, condition) {
  const key = cityName.toLowerCase();
  // Try exact match first
  if (CITY_IMAGES[key]) return CITY_IMAGES[key];
  // Try partial match
  for (const [k, v] of Object.entries(CITY_IMAGES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  // Weather fallback
  return WEATHER_IMAGES[condition] || WEATHER_IMAGES.default;
}

// ─────────────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────────────
const W_EMOJIS = {
  Clear:"☀️", Clouds:"⛅", Rain:"🌧️", Drizzle:"🌦️",
  Thunderstorm:"⛈️", Snow:"❄️", Mist:"🌫️", Fog:"🌁",
  Haze:"😶‍🌫️", Smoke:"💨", Dust:"🌪️", Tornado:"🌪️",
};

const round = n => Math.round(n);
const mpsToKmh = s => Math.round(s * 3.6);
const fmtTime = (unix, tz) =>
  new Date((unix + tz) * 1000).toUTCString().slice(17, 22);

// ─────────────────────────────────────────────────────────────────────
//  DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────
const T = {
  bg:      "#060a14",
  sky:     "#22d3ee",
  violet:  "#a78bfa",
  emerald: "#34d399",
  amber:   "#fbbf24",
  rose:    "#fb7185",
  orange:  "#fb923c",
  text:    "#f0f9ff",
  muted:   "#64748b",
  surface: "rgba(6,14,30,0.78)",
  border:  "rgba(34,211,238,0.13)",
};

const glass = (extra = {}) => ({
  background: T.surface,
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  border: `1px solid ${T.border}`,
  borderRadius: 20,
  ...extra,
});

const glow = (c = T.sky) => ({
  boxShadow: `0 0 28px ${c}35, 0 8px 48px rgba(0,0,0,0.45)`,
});

const gradText = (a = T.sky, b = T.violet) => ({
  background: `linear-gradient(135deg, ${a}, ${b})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
});

// ─────────────────────────────────────────────────────────────────────
//  GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:${T.bg};color:${T.text};font-family:'Space Grotesk',sans-serif;overflow-x:hidden;min-height:100vh}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:${T.sky}55;border-radius:4px}
input,button{font-family:inherit}
input::placeholder{color:${T.muted}}

@keyframes aurora{0%{transform:translateX(0)translateY(0)scale(1)}50%{transform:translateX(25px)translateY(-12px)scale(1.04)}100%{transform:translateX(0)translateY(0)scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spinR{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 28px ${T.sky}60,0 0 64px ${T.sky}20}50%{box-shadow:0 0 48px ${T.sky}90,0 0 96px ${T.sky}40}}
@keyframes dot1{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
@keyframes dot2{0%,30%,100%{transform:scale(0)}60%{transform:scale(1)}}
@keyframes dot3{0%,60%,100%{transform:scale(0)}80%{transform:scale(1)}}
@keyframes alertIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes bgZoom{0%{transform:scale(1.08)}100%{transform:scale(1)}}

/* Rain particles */
@keyframes rain{0%{transform:translateY(-10px)translateX(0);opacity:0}10%{opacity:.7}90%{opacity:.4}100%{transform:translateY(110vh)translateX(-30px);opacity:0}}
/* Snow particles */
@keyframes snow{0%{transform:translateY(-10px)translateX(0) rotate(0deg);opacity:0}10%{opacity:.9}90%{opacity:.5}100%{transform:translateY(110vh)translateX(60px) rotate(360deg);opacity:0}}
/* Lightning */
@keyframes lightning{0%,92%,96%,100%{opacity:0}93%,95%{opacity:.7}}

.lift{transition:transform .2s,box-shadow .2s}
.lift:hover{transform:translateY(-3px)}
.hover-bright:hover{filter:brightness(1.15)}
.tab-on{background:rgba(34,211,238,0.16)!important;border-color:${T.sky}70!important;color:${T.sky}!important}
`;

// ─────────────────────────────────────────────────────────────────────
//  WEATHER PARTICLE EFFECTS
// ─────────────────────────────────────────────────────────────────────
function WeatherParticles({ condition }) {
  if (!condition) return null;

  if (condition === "Rain" || condition === "Drizzle") {
    return (
      <div style={{ position:"fixed", inset:0, zIndex:2, pointerEvents:"none", overflow:"hidden" }}>
        {Array.from({length:60}).map((_, i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${Math.random()*100}%`,
            top:`${Math.random()*-10}%`,
            width: 1.5,
            height: Math.random()*18+8,
            background:`linear-gradient(to bottom, transparent, ${T.sky}70)`,
            borderRadius: 2,
            animation:`rain ${Math.random()*0.8+0.6}s linear ${Math.random()*2}s infinite`,
            opacity: 0,
          }} />
        ))}
      </div>
    );
  }

  if (condition === "Thunderstorm") {
    return (
      <div style={{ position:"fixed", inset:0, zIndex:2, pointerEvents:"none", overflow:"hidden" }}>
        {/* Heavy rain */}
        {Array.from({length:80}).map((_, i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${Math.random()*100}%`,
            top:`${Math.random()*-10}%`,
            width: 1,
            height: Math.random()*20+10,
            background:`linear-gradient(to bottom, transparent, rgba(180,180,255,0.65))`,
            animation:`rain ${Math.random()*0.5+0.4}s linear ${Math.random()*1.5}s infinite`,
            opacity: 0,
          }} />
        ))}
        {/* Lightning flash */}
        <div style={{
          position:"absolute", inset:0,
          background:"rgba(220,230,255,0.18)",
          animation:"lightning 4s ease-in-out infinite",
        }} />
      </div>
    );
  }

  if (condition === "Snow") {
    return (
      <div style={{ position:"fixed", inset:0, zIndex:2, pointerEvents:"none", overflow:"hidden" }}>
        {Array.from({length:50}).map((_, i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${Math.random()*100}%`,
            top:`${Math.random()*-10}%`,
            width: Math.random()*5+3,
            height: Math.random()*5+3,
            background:"rgba(255,255,255,0.85)",
            borderRadius:"50%",
            filter:"blur(0.5px)",
            animation:`snow ${Math.random()*4+3}s linear ${Math.random()*5}s infinite`,
            opacity:0,
          }} />
        ))}
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────
//  BACKGROUND
// ─────────────────────────────────────────────────────────────────────
function Background({ imageUrl, condition }) {
  const tones = {
    Clear:        "rgba(10,30,15,0.55)",
    Clouds:       "rgba(10,18,30,0.65)",
    Rain:         "rgba(5,15,28,0.70)",
    Thunderstorm: "rgba(8,5,22,0.78)",
    Snow:         "rgba(10,16,32,0.60)",
    Mist:         "rgba(12,16,24,0.70)",
    default:      "rgba(6,10,20,0.65)",
  };
  const tone = tones[condition] || tones.default;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:0 }}>
      {/* City/weather photo */}
      {imageUrl && (
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:`url(${imageUrl})`,
          backgroundSize:"cover", backgroundPosition:"center",
          animation:"bgZoom 20s ease-out forwards",
          transition:"background-image 1.5s ease",
        }} />
      )}
      {/* Dark overlay */}
      <div style={{ position:"absolute", inset:0, background:tone, transition:"background 1.5s ease" }} />
      {/* Aurora glow */}
      <div style={{
        position:"absolute", inset:0,
        background:`
          radial-gradient(ellipse 75% 40% at 15% 5%, rgba(34,211,238,0.10) 0%, transparent 55%),
          radial-gradient(ellipse 60% 35% at 85% 90%, rgba(167,139,250,0.08) 0%, transparent 55%),
          radial-gradient(ellipse 45% 28% at 50% 50%, rgba(52,211,153,0.04) 0%, transparent 55%)
        `,
        animation:"aurora 12s ease-in-out infinite",
      }} />
      {/* Grid */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"radial-gradient(rgba(34,211,238,0.07) 1px, transparent 1px)",
        backgroundSize:"52px 52px",
      }} />
      {/* Bottom fade */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"40%",
        background:`linear-gradient(to top, ${T.bg} 0%, transparent 100%)`,
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  STAT CARD
// ─────────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, unit, accent = T.sky, sub }) {
  return (
    <div className="lift" style={{ ...glass(), padding:"16px 18px", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{
        width:46, height:46, borderRadius:14, flexShrink:0,
        background:`${accent}1a`,
        border:`1px solid ${accent}28`,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 0 16px ${accent}20`,
      }}>
        <Icon size={20} color={accent} />
      </div>
      <div>
        <div style={{ color:T.muted, fontSize:11, textTransform:"uppercase", letterSpacing:"0.13em", marginBottom:3 }}>{label}</div>
        <div style={{ color:T.text, fontSize:20, fontWeight:700, fontFamily:"'Rajdhani',sans-serif", letterSpacing:"0.04em", lineHeight:1 }}>
          {value}<span style={{ fontSize:12, color:T.muted, marginLeft:4, fontWeight:400, letterSpacing:0 }}>{unit}</span>
        </div>
        {sub && <div style={{ color:T.muted, fontSize:10, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  FORECAST DAY CARD
// ─────────────────────────────────────────────────────────────────────
function ForecastCard({ day, date, temp, tempMin, tempMax, humidity, condition, wind, active, onClick }) {
  return (
    <div className="lift" onClick={onClick} style={{
      ...glass({
        borderColor: active ? `${T.sky}55` : T.border,
        background: active ? "rgba(34,211,238,0.11)" : T.surface,
        borderRadius:16,
      }),
      ...(active ? glow(T.sky) : {}),
      padding:"17px 13px", textAlign:"center",
      minWidth:108, flex:"0 0 auto", cursor:"pointer",
      transition:"all .2s",
    }}>
      <div style={{ color:active?T.sky:T.muted, fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>{day}</div>
      <div style={{ color:T.muted, fontSize:10, marginBottom:10 }}>{date}</div>
      <div style={{ fontSize:28, marginBottom:8, filter:"drop-shadow(0 0 6px rgba(255,200,60,0.5))" }}>{W_EMOJIS[condition] || "🌡️"}</div>
      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.text, letterSpacing:"0.04em" }}>{temp}°</div>
      <div style={{ color:T.muted, fontSize:10, marginBottom:8 }}>{tempMin}° / {tempMax}°</div>
      <div style={{ display:"flex", justifyContent:"center", gap:6 }}>
        <span style={{ color:T.sky, fontSize:10 }}>💧{humidity}%</span>
        <span style={{ color:T.emerald, fontSize:10 }}>💨{wind}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  ALERT BANNER
// ─────────────────────────────────────────────────────────────────────
function AlertBanner({ alerts, dismiss }) {
  if (!alerts.length) return null;
  const colors = { danger:T.rose, warning:T.amber, info:T.sky };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
      {alerts.map((a, i) => (
        <div key={i} style={{
          ...glass({ borderColor:`${colors[a.type]||T.sky}45`, borderRadius:14 }),
          padding:"11px 16px", display:"flex", alignItems:"center", gap:10,
          animation:"alertIn .3s ease",
        }}>
          <AlertTriangle size={15} color={colors[a.type]} style={{flexShrink:0}} />
          <span style={{ color:T.text, fontSize:13, flex:1 }}>{a.msg}</span>
          <button onClick={() => dismiss(i)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted }}>
            <X size={13}/>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  CHART TOOLTIP
// ─────────────────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...glass({ borderRadius:12 }), padding:"10px 14px" }}>
      <div style={{ color:T.muted, fontSize:11, marginBottom:5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color:p.color, fontSize:13, fontWeight:600 }}>
          {p.name}: {p.value}{p.name==="Temp"?"°C":p.name==="Humidity"?"%":" km/h"}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  🤖  GROQ CHATBOT
// ─────────────────────────────────────────────────────────────────────
function ChatBot({ weather, open, setOpen, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 200); }, [open]);

  const buildContext = () => {
    if (!weather) return "No weather data loaded yet.";
    return `City: ${weather.name}, ${weather.sys?.country}
Condition: ${weather.weather[0].description} (${weather.weather[0].main})
Temperature: ${round(weather.main.temp)}°C | Feels like: ${round(weather.main.feels_like)}°C
Humidity: ${weather.main.humidity}% | Wind: ${mpsToKmh(weather.wind.speed)} km/h
Visibility: ${((weather.visibility||10000)/1000).toFixed(1)} km | Pressure: ${weather.main.pressure} hPa
Today's High: ${round(weather.main.temp_max)}°C | Today's Low: ${round(weather.main.temp_min)}°C`;
  };

  const send = async (txt) => {
    const msg = (txt || input).trim();
    if (!msg || loading) return;
    setInput("");
    const userMsg = { role:"user", content:msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const ctx = buildContext();
      const historyMsgs = updated.slice(-12).map(m => ({ role:m.role, content:m.content }));

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model:"llama-3.3-70b-versatile",
          max_tokens:600,
          temperature:0.75,
          messages:[
            {
              role:"system",
              content:`You are Lini, a witty and friendly AI weather companion inside the Lini_Tech Weather Dashboard.
Your specialties: travel tips, picnic ideas, outdoor/indoor activity suggestions, packing advice, safety warnings — all weather-aware and location-specific.
Keep answers concise (2-4 sentences max), conversational, upbeat with relevant emojis.
Always reference the actual current weather data when giving advice.
If asked about budget, suggest cost-effective options with rough price estimates.

Current Live Weather Context:
${ctx}`
            },
            ...historyMsgs,
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Groq API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Hmm, couldn't get a response. Please try again!";
      setMessages(p => [...p, { role:"assistant", content:reply }]);
    } catch (err) {
      setMessages(p => [...p, {
        role:"assistant",
        content:`⚠️ ${err.message || "Connection issue — please try again!"}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK = [
    "🧺 Good day for a picnic?",
    "🏃 Outdoor activities today?",
    "✈️ Travel ideas under $100",
    "👗 What should I wear?",
    "🛡️ Any safety tips?",
    "🌮 Best dining spots nearby?",
  ];

  return (
    <>
      {open && (
        <div style={{
          position:"fixed", bottom:90, right:24, zIndex:1000,
          width:378, maxHeight:"80vh",
          ...glass({ borderRadius:22 }),
          display:"flex", flexDirection:"column",
          animation:"slideUp .25s ease",
          ...glow(T.sky),
        }}>
          {/* Header */}
          <div style={{
            padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexShrink:0,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:42, height:42, borderRadius:"50%",
                background:`linear-gradient(135deg,${T.sky},${T.violet})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                ...glow(T.sky),
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.text }}>Lini AI</div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:T.emerald, boxShadow:`0 0 8px ${T.emerald}` }} />
                  <span style={{ color:T.emerald, fontSize:11 }}>Live · Powered by Groq LLaMA</span>
                </div>
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={{
              background:"rgba(255,255,255,0.06)", border:`1px solid ${T.border}`,
              borderRadius:9, padding:"6px 8px", cursor:"pointer", color:T.muted,
            }}>
              <X size={14}/>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 12px", display:"flex", flexDirection:"column", gap:11, minHeight:0 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", animation:"fadeIn .25s ease" }}>
                {m.role==="assistant" && (
                  <div style={{
                    width:28, height:28, borderRadius:"50%", flexShrink:0,
                    background:`linear-gradient(135deg,${T.sky},${T.violet})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginRight:8, alignSelf:"flex-end",
                  }}>
                    <Bot size={13} color="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth:"84%", padding:"10px 14px", fontSize:13, lineHeight:1.6,
                  borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role==="user"
                    ? `linear-gradient(135deg,${T.sky}22,${T.violet}22)`
                    : "rgba(255,255,255,0.05)",
                  border:`1px solid ${m.role==="user"?T.sky+"40":T.border}`,
                  color:T.text, wordBreak:"break-word",
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${T.sky},${T.violet})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Bot size={13} color="#fff"/>
                </div>
                <div style={{ ...glass({borderRadius:"16px 16px 16px 4px"}), padding:"13px 16px", display:"flex", gap:5, alignItems:"center" }}>
                  {["dot1","dot2","dot3"].map((a,i) => (
                    <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:T.sky, animation:`${a} 1.2s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div style={{ padding:"0 10px 10px", display:"flex", flexWrap:"wrap", gap:6, flexShrink:0 }}>
              {QUICK.map((q, i) => (
                <button key={i} onClick={()=>send(q)} style={{
                  background:"rgba(34,211,238,0.08)", border:`1px solid ${T.border}`,
                  borderRadius:20, padding:"5px 11px", color:T.sky, fontSize:11,
                  cursor:"pointer", transition:"background .15s",
                }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(34,211,238,0.18)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(34,211,238,0.08)"}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8, flexShrink:0 }}>
            <input ref={inputRef}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && !e.shiftKey && send()}
              placeholder="Ask about travel, activities, budget…"
              style={{
                flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`,
                borderRadius:11, padding:"9px 13px", color:T.text, fontSize:13, outline:"none",
                transition:"border-color .2s",
              }}
              onFocus={e=>e.target.style.borderColor=T.sky}
              onBlur={e=>e.target.style.borderColor=T.border}
            />
            <button onClick={()=>send()} disabled={loading||!input.trim()} style={{
              width:40, height:40, borderRadius:11, border:"none",
              background:loading?"rgba(34,211,238,0.3)":`linear-gradient(135deg,${T.sky},${T.violet})`,
              cursor:loading||!input.trim()?"not-allowed":"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              opacity:!input.trim()?0.5:1, transition:"opacity .2s",
              flexShrink:0,
            }}>
              <Send size={15} color="#fff"/>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={()=>setOpen(p=>!p)} style={{
        position:"fixed", bottom:24, right:24, zIndex:1001,
        width:60, height:60, borderRadius:"50%", border:"none",
        background:`linear-gradient(135deg,${T.sky},${T.violet})`,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        transition:"transform .2s",
        animation:open?"none":"pulse 3s ease-in-out infinite",
      }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        title="Chat with Lini AI"
      >
        {open ? <X size={24} color="#fff"/> : <Bot size={24} color="#fff"/>}
      </button>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  POPULAR CITIES BAR
// ─────────────────────────────────────────────────────────────────────
const POPULAR = [
  "London","New York","Tokyo","Paris","Dubai",
  "Singapore","Sydney","Mumbai","Toronto","Berlin",
];

// ─────────────────────────────────────────────────────────────────────
//  🌍  MAIN APP
// ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [city,       setCity]       = useState("London");
  const [query,      setQuery]      = useState("");
  const [weather,    setWeather]    = useState(null);
  const [forecast,   setForecast]   = useState([]);
  const [chartData,  setChartData]  = useState([]);
  const [bgUrl,      setBgUrl]      = useState("");
  const [favorites,  setFavorites]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("lt_favs")||"[]"); } catch { return []; }
  });
  const [alerts,     setAlerts]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [chatOpen,   setChatOpen]   = useState(false);
  const [chatMsgs,   setChatMsgs]   = useState([{
    role:"assistant",
    content:"👋 Hi! I'm Lini — your AI weather companion powered by Groq LLaMA. Ask me about picnics, travel ideas, what to wear, or activities based on today's live weather!",
  }]);
  const [activeTab,  setActiveTab]  = useState("Temp");
  const [activeFcDay,setActiveFcDay]= useState(0);
  const [darkMode,   setDarkMode]   = useState(true);

  // Inject CSS once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Auto-fetch on city change
  useEffect(() => { fetchWeather(city); }, [city]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("lt_favs", JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeather = async (name) => {
    setLoading(true); setError("");
    try {
      const [wR, fR] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${OW_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(name)}&appid=${OW_KEY}&units=metric`),
      ]);
      if (!wR.ok) { const d=await wR.json(); throw new Error(d.message||`City "${name}" not found`); }

      const w = await wR.json();
      const f = await fR.json();
      setWeather(w);

      const cond = w.weather[0].main;

      // Set background from city image map
      setBgUrl(getCityImage(w.name, cond));

      // Build daily forecast (5 days)
      const seen=new Set(), daily=[];
      (f.list||[]).forEach(item => {
        const d = new Date(item.dt*1000);
        const key = d.toDateString();
        if (!seen.has(key) && daily.length<5) {
          seen.add(key);
          daily.push({
            day:  d.toLocaleDateString("en-US",{weekday:"short"}),
            date: d.toLocaleDateString("en-US",{month:"short",day:"numeric"}),
            temp: round(item.main.temp),
            tempMin: round(item.main.temp_min),
            tempMax: round(item.main.temp_max),
            humidity: item.main.humidity,
            condition: item.weather[0].main,
            description: item.weather[0].description,
            wind: mpsToKmh(item.wind.speed),
          });
        }
      });
      setForecast(daily);
      setActiveFcDay(0);

      // Chart data — next 24h (8 points × 3h)
      setChartData((f.list||[]).slice(0,8).map(item => ({
        time: new Date(item.dt*1000).toLocaleTimeString("en-US",{hour:"2-digit",hour12:false}),
        Temp: round(item.main.temp),
        Humidity: item.main.humidity,
        Wind: mpsToKmh(item.wind.speed),
      })));

      // Build alerts
      const newA=[];
      const temp=w.main.temp, ws=w.wind.speed, hum=w.main.humidity;
      if (cond==="Thunderstorm") newA.push({type:"danger",  msg:"⛈️ Thunderstorm warning! Stay indoors and away from open spaces."});
      if (temp>38)               newA.push({type:"danger",  msg:`🌡️ Extreme heat alert — ${round(temp)}°C! Stay hydrated, avoid noon sun.`});
      if (temp<0)                newA.push({type:"warning", msg:`❄️ Freezing temperatures — ${round(temp)}°C! Dress in layers, watch for ice.`});
      if (ws>15)                 newA.push({type:"warning", msg:`💨 Strong winds: ${mpsToKmh(ws)} km/h. Secure loose outdoor items.`});
      if (hum>90)                newA.push({type:"info",    msg:`💧 Very high humidity: ${hum}%. Stay cool and drink plenty of water.`});
      if (cond==="Snow")         newA.push({type:"info",    msg:"❄️ Snowfall expected. Roads may be slippery — drive carefully!"});
      setAlerts(newA);

    } catch(e) {
      setError(e.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const doSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) { setCity(query.trim()); setQuery(""); }
  };

  const toggleFav = (c) => {
    setFavorites(p => p.includes(c) ? p.filter(f=>f!==c) : [...p, c]);
  };

  const cond   = weather?.weather[0]?.main || "";
  const isFav  = favorites.includes(weather?.name || city);
  const TABS   = ["Temp","Humidity","Wind"];
  const ACCENT = { Temp:T.sky, Humidity:T.violet, Wind:T.emerald };
  const GRAD   = { Temp:"gTmp",   Humidity:"gHum",   Wind:"gWnd"  };

  return (
    <div style={{ minHeight:"100vh", position:"relative" }}>
      <Background imageUrl={bgUrl} condition={cond} />
      <WeatherParticles condition={cond} />

      <div style={{ position:"relative", zIndex:10 }}>

        {/* ══ NAVBAR ════════════════════════════════════════════════ */}
        <nav style={{
          ...glass({ borderRadius:0, borderLeft:"none", borderRight:"none", borderTop:"none" }),
          padding:"0 28px", height:64,
          display:"flex", alignItems:"center", gap:18,
        }}>
          {/* Logo */}
          <div style={{
            fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20,
            ...gradText(T.sky,T.violet), letterSpacing:"0.05em", flexShrink:0,
          }}>LINI_TECH</div>

          {/* Search */}
          <form onSubmit={doSearch} style={{ display:"flex", gap:8, flex:1, maxWidth:400 }}>
            <div style={{ position:"relative", flex:1 }}>
              <Search size={14} color={T.muted} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
              <input
                value={query}
                onChange={e=>setQuery(e.target.value)}
                placeholder="Search any city worldwide…"
                style={{
                  width:"100%", background:"rgba(255,255,255,0.05)",
                  border:`1px solid ${T.border}`, borderRadius:11,
                  padding:"9px 12px 9px 36px", color:T.text, fontSize:13, outline:"none",
                }}
                onFocus={e=>e.target.style.borderColor=T.sky}
                onBlur={e=>e.target.style.borderColor=T.border}
              />
            </div>
            <button type="submit" style={{
              background:`linear-gradient(135deg,${T.sky},${T.violet})`,
              border:"none", borderRadius:11, padding:"9px 18px",
              color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", flexShrink:0,
            }}>Search</button>
          </form>

          {/* Popular cities (scrollable) */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", flex:1,
            scrollbarWidth:"none", msOverflowStyle:"none" }}>
            {POPULAR.map((c, i) => (
              <button key={i} onClick={()=>setCity(c)} style={{
                background: city===c||weather?.name===c ? "rgba(34,211,238,0.16)" : "rgba(255,255,255,0.05)",
                border:`1px solid ${city===c||weather?.name===c ? T.sky+"60" : T.border}`,
                borderRadius:8, padding:"5px 12px",
                color:city===c||weather?.name===c?T.sky:T.muted, fontSize:12,
                cursor:"pointer", flexShrink:0, transition:"all .15s",
              }}>{c}</button>
            ))}
          </div>

          {/* Refresh */}
          <button onClick={()=>fetchWeather(weather?.name||city)} title="Refresh" style={{
            background:"rgba(255,255,255,0.05)", border:`1px solid ${T.border}`,
            borderRadius:9, padding:"8px 10px", cursor:"pointer", color:T.muted, flexShrink:0,
          }}>
            <RefreshCw size={15} style={loading?{animation:"spinR .8s linear infinite"}:{}}/>
          </button>
        </nav>

        {/* ══ MAIN CONTENT ══════════════════════════════════════════ */}
        <div style={{ padding:"24px 28px 100px", maxWidth:1480, margin:"0 auto" }}>

          <AlertBanner alerts={alerts} dismiss={i=>setAlerts(p=>p.filter((_,j)=>j!==i))}/>

          {/* Error */}
          {error && (
            <div style={{ ...glass({borderColor:`${T.rose}45`,borderRadius:14}), padding:"14px 18px", marginBottom:20, color:T.rose, display:"flex", alignItems:"center", gap:10 }}>
              <AlertTriangle size={17}/> {error}
            </div>
          )}

          {/* Loading */}
          {loading && !weather && (
            <div style={{ textAlign:"center", padding:120 }}>
              <div style={{ fontSize:52, marginBottom:16, animation:"float 2s ease-in-out infinite" }}>🌦️</div>
              <RefreshCw size={28} color={T.sky} style={{ animation:"spinR 1s linear infinite", display:"inline-block" }}/>
              <div style={{ color:T.muted, marginTop:14 }}>Fetching live weather…</div>
            </div>
          )}

          {/* Empty */}
          {!weather && !loading && !error && (
            <div style={{ textAlign:"center", padding:120 }}>
              <div style={{ fontSize:64, marginBottom:20, animation:"float 3s ease-in-out infinite" }}>🌍</div>
              <div style={{ fontFamily:"'Syne',sans-serif", ...gradText(T.sky,T.violet), fontSize:28, fontWeight:800, marginBottom:8 }}>
                Welcome to Lini_Tech
              </div>
              <div style={{ color:T.muted }}>Search any city to see live weather intelligence</div>
            </div>
          )}

          {/* ════ DASHBOARD ══════════════════════════════════════════ */}
          {weather && (
            <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:24, alignItems:"start" }}>

              {/* ── LEFT ── */}
              <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

                {/* MAIN WEATHER HERO */}
                <div style={{ ...glass(), padding:"30px 32px", ...glow(T.sky), animation:"slideUp .4s ease" }}>
                  {/* City + fav */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
                        <MapPin size={16} color={T.sky}/>
                        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:26, color:T.text }}>{weather.name}</span>
                        <span style={{ color:T.muted, fontSize:15 }}>{weather.sys.country}</span>
                        <button onClick={()=>toggleFav(weather.name)} style={{ background:"none", border:"none", cursor:"pointer", color:isFav?T.amber:T.muted, marginLeft:2 }}>
                          <Star size={17} fill={isFav?T.amber:"none"}/>
                        </button>
                      </div>
                      <div style={{ color:T.muted, fontSize:12 }}>
                        {new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} ·{" "}
                        {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                      </div>
                    </div>
                    {/* AQI/Coord badge */}
                    <div style={{ ...glass({borderRadius:12}), padding:"7px 14px", fontSize:11, color:T.muted }}>
                      {weather.coord.lat.toFixed(2)}°, {weather.coord.lon.toFixed(2)}°
                    </div>
                  </div>

                  {/* Temp + icon */}
                  <div style={{ display:"flex", alignItems:"center", gap:30, marginBottom:28 }}>
                    <div style={{ fontSize:82, filter:"drop-shadow(0 0 24px rgba(255,210,60,0.55))", animation:"float 4s ease-in-out infinite" }}>
                      {W_EMOJIS[cond] || "🌡️"}
                    </div>
                    <div>
                      <div style={{
                        fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:88, lineHeight:1,
                        ...gradText(T.text, T.sky), letterSpacing:"-0.02em",
                      }}>
                        {round(weather.main.temp)}°
                      </div>
                      <div style={{ color:T.muted, fontSize:16, marginTop:5, textTransform:"capitalize" }}>
                        {weather.weather[0].description}
                      </div>
                      <div style={{ color:T.muted, fontSize:12, marginTop:4 }}>
                        Feels like{" "}<span style={{ color:T.text, fontWeight:600 }}>{round(weather.main.feels_like)}°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div style={{ display:"flex", gap:22, paddingTop:20, borderTop:`1px solid ${T.border}`, flexWrap:"wrap" }}>
                    {[
                      ["HIGH", `${round(weather.main.temp_max)}°C`, T.rose],
                      ["LOW",  `${round(weather.main.temp_min)}°C`, T.sky],
                      ["PRESSURE",  `${weather.main.pressure} hPa`, T.muted],
                      ["SUNRISE",   fmtTime(weather.sys.sunrise, weather.timezone), T.amber],
                      ["SUNSET",    fmtTime(weather.sys.sunset,  weather.timezone), T.violet],
                      ["CLOUDS",    `${weather.clouds?.all||0}%`, T.muted],
                    ].map(([l,v,c],i) => (
                      <div key={i}>
                        <div style={{ color:T.muted, fontSize:10, textTransform:"uppercase", letterSpacing:"0.12em" }}>{l}</div>
                        <div style={{ color:c, fontSize:14, fontWeight:700, fontFamily:"'Rajdhani',sans-serif", marginTop:2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STAT GRID */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, animation:"slideUp .5s ease" }}>
                  <StatCard icon={Droplets}    label="Humidity"    value={weather.main.humidity} unit="%" accent={T.sky}     sub={weather.main.humidity>80?"High humidity":"Normal"} />
                  <StatCard icon={Wind}        label="Wind Speed"  value={mpsToKmh(weather.wind.speed)} unit="km/h" accent={T.violet} sub={`Direction ${weather.wind.deg||0}°`} />
                  <StatCard icon={Eye}         label="Visibility"  value={((weather.visibility||10000)/1000).toFixed(1)} unit="km" accent={T.emerald} />
                  <StatCard icon={Gauge}       label="Pressure"    value={weather.main.pressure} unit="hPa" accent={T.amber} />
                </div>

                {/* FAVORITES */}
                {favorites.length>0 && (
                  <div style={{ ...glass(), padding:"20px 22px", animation:"slideUp .6s ease" }}>
                    <div style={{ color:T.muted, fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:14 }}>⭐ Saved Cities</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {favorites.map((fav,i) => (
                        <div key={i} style={{ display:"flex" }}>
                          <button onClick={()=>setCity(fav)} style={{
                            background:weather?.name===fav?"rgba(34,211,238,0.16)":"rgba(255,255,255,0.05)",
                            border:`1px solid ${weather?.name===fav?T.sky+"60":T.border}`,
                            borderRadius:"9px 0 0 9px", padding:"7px 14px",
                            color:weather?.name===fav?T.sky:T.text, fontSize:13, cursor:"pointer",
                          }}>{fav}</button>
                          <button onClick={()=>toggleFav(fav)} style={{
                            background:"rgba(251,113,133,0.08)", border:`1px solid rgba(251,113,133,0.28)`,
                            borderLeft:"none", borderRadius:"0 9px 9px 0", padding:"7px 10px",
                            color:T.rose, cursor:"pointer",
                          }}><X size={11}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI SUMMARY */}
                <div style={{ ...glass(), padding:"22px 24px", ...glow(T.violet), animation:"slideUp .7s ease" }}>
                  <div style={{ color:T.muted, fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:16 }}>🤖 Lini AI — Live Insight</div>
                  <div style={{ display:"flex", gap:14, marginBottom:18 }}>
                    <div style={{
                      width:46, height:46, borderRadius:"50%", flexShrink:0,
                      background:`linear-gradient(135deg,${T.sky},${T.violet})`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      ...glow(T.sky),
                    }}><Bot size={21} color="#fff"/></div>
                    <div style={{
                      flex:1, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`,
                      borderRadius:"14px 14px 14px 4px", padding:"12px 16px",
                      color:T.text, fontSize:13, lineHeight:1.7,
                    }}>
                      {cond==="Clear"       && `✨ Gorgeous clear skies over ${weather.name}! Perfect for sightseeing, rooftop dining, or a beach day. Don't forget SPF — UV may be high!`}
                      {cond==="Rain"        && `🌧️ Rainy day in ${weather.name}. Ideal time for cozy cafés, museums, or a movie marathon. Pack an umbrella if you head out!`}
                      {cond==="Clouds"      && `⛅ Overcast but pleasant in ${weather.name}. Great for hiking without harsh sun, or exploring the city streets. Perfect photography light!`}
                      {cond==="Thunderstorm"&& `⛈️ Active thunderstorm over ${weather.name}! Please stay indoors, away from windows and tall trees. Monitor local emergency updates.`}
                      {cond==="Snow"        && `❄️ Winter wonderland in ${weather.name}! Great for skiing or hot chocolate by the fireplace. Roads may be icy — stay careful!`}
                      {cond==="Drizzle"     && `🌦️ Light drizzle in ${weather.name}. A compact umbrella and light jacket are all you need. Indoor markets and galleries are a great call!`}
                      {cond==="Mist"||cond==="Fog"||cond==="Haze"
                        ? `🌫️ Misty conditions in ${weather.name}. Visibility is reduced — drive with extra care. Beautiful atmospheric conditions for moody photography!`
                        : null}
                      {!["Clear","Rain","Clouds","Thunderstorm","Snow","Drizzle","Mist","Fog","Haze"].includes(cond)
                        && `🌡️ ${weather.weather[0].description} at ${round(weather.main.temp)}°C in ${weather.name}. Ask Lini AI for personalized activity suggestions!`}
                    </div>
                  </div>
                  <button onClick={()=>setChatOpen(true)} style={{
                    width:"100%", background:`linear-gradient(135deg,${T.sky}1a,${T.violet}1a)`,
                    border:`1px solid ${T.sky}40`, borderRadius:12,
                    padding:"12px", color:T.sky, fontSize:13, fontWeight:600,
                    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    transition:"background .2s",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background=`linear-gradient(135deg,${T.sky}28,${T.violet}28)`}
                    onMouseLeave={e=>e.currentTarget.style.background=`linear-gradient(135deg,${T.sky}1a,${T.violet}1a)`}
                  >
                    <Bot size={15}/> Ask Lini AI for personalised advice →
                  </button>
                </div>
              </div>

              {/* ── RIGHT ── */}
              <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

                {/* 5-DAY FORECAST */}
                <div style={{ ...glass(), padding:"22px 24px", animation:"slideUp .45s ease" }}>
                  <div style={{ color:T.muted, fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:18 }}>📅 5-Day Forecast</div>
                  <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6,
                    scrollbarWidth:"none", msOverflowStyle:"none" }}>
                    {forecast.map((f,i) => (
                      <ForecastCard key={i} {...f} active={activeFcDay===i} onClick={()=>setActiveFcDay(i)}/>
                    ))}
                    {!forecast.length && <div style={{ color:T.muted }}>Loading forecast…</div>}
                  </div>

                  {/* Selected day detail */}
                  {forecast[activeFcDay] && (
                    <div style={{
                      marginTop:18, paddingTop:18, borderTop:`1px solid ${T.border}`,
                      animation:"fadeIn .3s ease",
                    }}>
                      <div style={{ color:T.muted, fontSize:12, marginBottom:12 }}>
                        <span style={{ color:T.text, fontWeight:600 }}>{forecast[activeFcDay].day}, {forecast[activeFcDay].date}</span>
                        {" · "}{forecast[activeFcDay].description}
                      </div>
                      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                        {[
                          ["🌡️ High",    `${forecast[activeFcDay].tempMax}°C`, T.rose],
                          ["❄️ Low",     `${forecast[activeFcDay].tempMin}°C`, T.sky],
                          ["💧 Humidity",`${forecast[activeFcDay].humidity}%`, T.violet],
                          ["💨 Wind",    `${forecast[activeFcDay].wind} km/h`, T.emerald],
                        ].map(([l,v,c],i) => (
                          <div key={i}>
                            <div style={{ color:T.muted, fontSize:10 }}>{l}</div>
                            <div style={{ color:c, fontSize:15, fontWeight:700, fontFamily:"'Rajdhani',sans-serif", marginTop:2 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CHARTS */}
                <div style={{ ...glass(), padding:"22px 24px", animation:"slideUp .5s ease" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div style={{ color:T.muted, fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em" }}>📈 24-Hour Trends</div>
                    <div style={{ display:"flex", gap:6 }}>
                      {TABS.map(t => (
                        <button key={t} onClick={()=>setActiveTab(t)} className={activeTab===t?"tab-on":""} style={{
                          background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`,
                          borderRadius:8, padding:"5px 12px", color:T.muted, fontSize:11,
                          cursor:"pointer", transition:"all .15s",
                        }}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={210}>
                    <AreaChart data={chartData} margin={{top:5,right:5,left:-24,bottom:0}}>
                      <defs>
                        <linearGradient id="gTmp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={T.sky}     stopOpacity={0.38}/>
                          <stop offset="95%" stopColor={T.sky}     stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gHum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={T.violet}  stopOpacity={0.38}/>
                          <stop offset="95%" stopColor={T.violet}  stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gWnd" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={T.emerald} stopOpacity={0.38}/>
                          <stop offset="95%" stopColor={T.emerald} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                      <XAxis dataKey="time" tick={{fill:T.muted,fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:T.muted,fontSize:11}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Area type="monotone" dataKey={activeTab}
                        stroke={ACCENT[activeTab]} strokeWidth={2.5}
                        fill={`url(#${GRAD[activeTab]})`} dot={false}
                        activeDot={{r:5,fill:ACCENT[activeTab],strokeWidth:0}}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Bar comparison */}
                  <div style={{ marginTop:20, paddingTop:18, borderTop:`1px solid ${T.border}` }}>
                    <div style={{ color:T.muted, fontSize:11, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.1em" }}>Daily High / Low</div>
                    <ResponsiveContainer width="100%" height={95}>
                      <BarChart data={forecast} margin={{top:0,right:0,left:-22,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                        <XAxis dataKey="day" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                        <Tooltip content={({active,payload,label})=>active&&payload?.length
                          ?<div style={{...glass({borderRadius:10}),padding:"8px 12px"}}>
                            <div style={{color:T.muted,fontSize:10,marginBottom:3}}>{label}</div>
                            <div style={{color:T.rose,fontSize:12}}>High: {payload[0]?.value}°C</div>
                            <div style={{color:T.sky,fontSize:12}}>Low: {payload[1]?.value}°C</div>
                          </div>:null}
                        />
                        <Bar dataKey="tempMax" fill={T.rose}   radius={[4,4,0,0]} maxBarSize={26}/>
                        <Bar dataKey="tempMin" fill={T.sky}    radius={[4,4,0,0]} maxBarSize={26}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* RADAR CARD */}
                <div style={{ ...glass(), padding:"22px 24px", animation:"slideUp .6s ease" }}>
                  <div style={{ color:T.muted, fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:16 }}>🌐 Condition Radar</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={[
                      { m:"Temp",     v:Math.min(100,Math.max(0,(weather.main.temp+20)*2)) },
                      { m:"Humidity", v:weather.main.humidity },
                      { m:"Wind",     v:Math.min(100,mpsToKmh(weather.wind.speed)*2) },
                      { m:"Pressure", v:Math.min(100,(weather.main.pressure-950)/0.6) },
                      { m:"Clouds",   v:weather.clouds?.all||0 },
                      { m:"Visibility",v:Math.min(100,(weather.visibility||10000)/100) },
                    ]}>
                      <PolarGrid stroke="rgba(255,255,255,0.07)"/>
                      <PolarAngleAxis dataKey="m" tick={{fill:T.muted,fontSize:11}}/>
                      <Radar dataKey="v" stroke={T.sky} fill={T.sky} fillOpacity={0.18} strokeWidth={2}/>
                    </RadarChart>
                  </ResponsiveContainer>

                  {/* Extra weather info row */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:16, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
                    {[
                      ["🌅 Sunrise", fmtTime(weather.sys.sunrise, weather.timezone), T.amber],
                      ["🌇 Sunset",  fmtTime(weather.sys.sunset,  weather.timezone), T.orange],
                      ["☁️ Clouds",  `${weather.clouds?.all||0}%`, T.muted],
                    ].map(([l,v,c],i) => (
                      <div key={i} style={{ textAlign:"center" }}>
                        <div style={{ color:T.muted, fontSize:10 }}>{l}</div>
                        <div style={{ color:c, fontSize:14, fontWeight:700, fontFamily:"'Rajdhani',sans-serif", marginTop:3 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ CHATBOT ══════════════════════════════════════════════════ */}
      <ChatBot
        weather={weather}
        open={chatOpen}
        setOpen={setChatOpen}
        messages={chatMsgs}
        setMessages={setChatMsgs}
      />
    </div>
  );
}
