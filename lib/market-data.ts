export type Mode = "exposure" | "production";

export type Brand = { name: string; role: string };

export type MarketEntry = {
  id: string;
  label: string;
  region: string;
  lat: number;
  lng: number;
  color: string;
  mode: Mode;
  brands: readonly Brand[];
};

export type MarkerPhase = "exposure" | "production";

export type MarkerData = {
  id: string;
  phase: MarkerPhase;
  name: string;
  country: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
};

/* ─── Mode 1: Market Exposure ──────────────────────────────────────────── */
export const EXPOSURE_MARKETS: readonly MarketEntry[] = [
  {
    id: "usa", label: "United States", region: "Americas",
    lat: 37.0902, lng: -95.7129, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "Abercrombie & Fitch", role: "Global QA program · $200M portfolio" },
      { name: "Walmart", role: "Vendor compliance & quality audits" },
      { name: "Amazon", role: "Marketplace quality operations" },
    ],
  },
  {
    id: "uk", label: "United Kingdom", region: "Europe",
    lat: 55.3781, lng: -3.436, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "A&F Europe", role: "Sourcing & quality operations" },
    ],
  },
  {
    id: "belgium", label: "Belgium", region: "Europe",
    lat: 50.5039, lng: 4.4699, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "Bel&Bo", role: "Product quality oversight" },
    ],
  },
  {
    id: "netherlands", label: "Netherlands", region: "Europe",
    lat: 52.1326, lng: 5.2913, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "A&F Europe", role: "Regional brand partnerships" },
    ],
  },
  {
    id: "spain", label: "Spain", region: "Europe",
    lat: 40.4637, lng: -3.7492, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "A&F Europe", role: "Compliance & sourcing" },
    ],
  },
  {
    id: "uae", label: "Dubai / UAE", region: "West Asia",
    lat: 25.2048, lng: 55.2708, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "Babyshop", role: "Vendor quality audits" },
      { name: "Landmark Group", role: "Supply chain quality management" },
    ],
  },
  {
    id: "kuwait", label: "Kuwait", region: "West Asia",
    lat: 29.3, lng: 47.5, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "M.H. Alshaya Co.", role: "Retail quality compliance" },
    ],
  },
  {
    id: "india-exp", label: "India", region: "South Asia",
    lat: 20.5937, lng: 78.9629, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "A&F South Asia HQ", role: "Regional director · $200M program" },
      { name: "Snapdeal", role: "QMS build · defect rate 18% → 7.8%" },
      { name: "Flipkart", role: "Marketplace quality operations" },
      { name: "ABFRL", role: "Brand compliance & audits" },
      { name: "Mufti", role: "Apparel quality consulting" },
      { name: "Reliance Retail", role: "Vendor development" },
    ],
  },
  {
    id: "china-exp", label: "China", region: "East Asia",
    lat: 35.8617, lng: 104.1954, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "A&F China Operations", role: "Factory audits & quality ops" },
    ],
  },
  {
    id: "indonesia", label: "Indonesia", region: "APAC",
    lat: -2, lng: 117, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "A&F APAC", role: "Production quality oversight" },
    ],
  },
  {
    id: "australia", label: "Australia", region: "APAC",
    lat: -25, lng: 134, color: "#dc2626", mode: "exposure",
    brands: [
      { name: "Woolworths", role: "Apparel sourcing quality" },
    ],
  },
];

/* ─── Mode 2: Production Operations (APAC focus) ───────────────────────── */
export const PRODUCTION_MARKETS: readonly MarketEntry[] = [
  {
    id: "india-prod", label: "India", region: "South Asia",
    lat: 20.5937, lng: 78.9629, color: "#c2410c", mode: "production",
    brands: [
      { name: "Production Hub · 20+ Factories", role: "Cotton, synthetics & blends — Tier 1–3" },
      { name: "Geo-Chem Inspection", role: "QC office opened · AQL & pre-shipment" },
      { name: "HQTS LEAN Consultancy", role: "Program launched from blank page" },
      { name: "A&F South Asia", role: "End-to-end production oversight" },
    ],
  },
  {
    id: "bangladesh", label: "Bangladesh", region: "South Asia",
    lat: 23.685, lng: 90.3563, color: "#c2410c", mode: "production",
    brands: [
      { name: "RMG Sector · 15+ Partnerships", role: "Woven & knitwear — AQL inspections" },
      { name: "Geo-Chem Labs BD", role: "Inspection office opened" },
      { name: "Social Compliance Audits", role: "WRAP, BSCI, SA8000 certifications" },
    ],
  },
  {
    id: "china-prod", label: "China", region: "East Asia",
    lat: 35.8617, lng: 104.1954, color: "#c2410c", mode: "production",
    brands: [
      { name: "10+ Manufacturing Partners", role: "Apparel & accessories production" },
      { name: "Factory Compliance", role: "WRAP, BSCI, SA8000 audits" },
      { name: "Geo-Chem Labs CN", role: "Quality inspection operations" },
    ],
  },
  {
    id: "srilanka", label: "Sri Lanka", region: "South Asia",
    lat: 7.8731, lng: 80.7718, color: "#c2410c", mode: "production",
    brands: [
      { name: "Premium Knitwear Hub", role: "High-end jersey & underwear production" },
      { name: "Factory Compliance Audits", role: "Social & technical quality audits" },
      { name: "A&F Sri Lanka", role: "Regional production oversight" },
    ],
  },
];

export const ALL_MARKETS: readonly MarketEntry[] = [
  ...EXPOSURE_MARKETS,
  ...PRODUCTION_MARKETS,
];

export const MARKET_MARKERS: readonly MarkerData[] = ALL_MARKETS.map((market) => ({
  id: market.id,
  phase: market.mode,
  name: market.label,
  country: market.label,
  lat: market.lat,
  lng: market.lng,
  title: `${market.label} · ${market.region}`,
  description: market.brands.map((brand) => `${brand.name}: ${brand.role}`).join(" | "),
}));