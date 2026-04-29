"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* ─── Data ──────────────────────────────────────────────────────────── */
const CARD_DATA = [
  {
    id: "product",
    label: "Product Expertise",
    tagline: "From fiber to finished garment — every layer, every risk.",
    color: "#D4AF37",
    bg: "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(212,175,55,0.14) 0%, transparent 65%)",
    items: [
      {
        id: "garments",
        title: "GARMENTS (PRIMARY)",
        points: [
          "Women's Fashion & Casual: Specializing in high-complexity silhouettes — bias-cut garments, asymmetrical drapes, and fully pleated designs (sunray, knife, and box pleats). Focused on grainline stability and heat-setting precision to ensure drapes don't drop after hanging.",
          "Women's Swimwear: Expert in high-stretch recovery (Lycra/Spandex), chlorine/saltwater resistance, and specialized machinery (flatlock and zigzag) for low-profile, hygienic, and durable seam construction.",
          "Men's Fashion & Casual: Structured tailoring and rugged utility wear. Heavy-duty seam strength for denim and twills with millimetric precision in collar stands and sleeve plackets.",
          "Kids & Infant Wear: Strict adherence to EN 14682 — small-part security (90N pull tests), nickel-free hardware, and soft-seam technology to protect sensitive skin.",
          "Difficult Fabrics: Proven expertise managing slippery and unstable substrates — Satin, Georgette, Chiffon, Lace, Fine Voile, Crepe de Chine, Organza, and Velvet — where pile direction and tension control are non-negotiable.",
          "Heavy Embellishments: Engineering support structures for beadwork and zardosi to prevent fabric sagging or tearing; specialized interlining and backing protocols.",
          "Advanced Printing: Technical oversight of Digital, Screen (Plastisol/High-Density), and Sublimation printing — handfeel integrity and wash-fastness across varied fabric weights.",
          "Pre-Production Engineering: Risk-based styling analysis during sketch phase; custom acrylic jigs and folding templates for difficult operations; magnetic and mechanical swing guides on curved/bias edges.",
          "Floor Execution: Automated workflows with programmable pattern tackers; U-shaped finishing lines with integrated Light Boxes and steam-forming stations; Inline Pilot Run (50-piece Technical Trial) before bulk release.",
        ],
      },
      {
        id: "fiber",
        title: "FIBER & YARN",
        points: [
          "Composition Analysis: Technical knowledge of natural, synthetic, and regenerated fibers (Viscose, Modal, Lyocell) — performance characteristics, blending ratios, and downstream quality implications.",
          "Spinning Methods: Ring, open-end, compact, and combed spinning — yarn twist level, TPI, neps, and draw ratio; defects encoded at yarn stage propagate as skew or harness slip downstream.",
          "Sustainability Sourcing: GOTS-certified organic cotton, recycled polyester (rPET), and full traceability protocols across supply chains.",
        ],
      },
      {
        id: "fabric",
        title: "FABRIC & WEAVING",
        points: [
          "Woven Structures: Jacquard (per-end warp control, harness timing), Dobby (small repeats, engineered stripes), Honeycomb (waffle/cell geometry for performance fabrics).",
          "Knitting & Processing: Yarn dyeing, fabric processing, and color management across weft and warp knit constructions.",
          "Functional Durability: Light fastness, dimensional stability, and thread count verification for bedding, upholstery, and technical performance fabrics.",
        ],
      },
      {
        id: "processing",
        title: "GARMENT PROCESSING",
        points: [
          "Washing Techniques: Enzyme, bleach, and stone washing — chemical control, shade consistency, and back-staining prevention.",
          "Printing Oversight: Block, tie-dye, screen (mesh tension, squeegee pressure), and digital (file integrity, pretreatment, jet maintenance) — validated for wash-fastness.",
          "Embroidery & Embellishments: Risk assessment for hand, wash durability, and regulatory safety; engineering support structures for heavy beadwork and zardosi.",
          "Sublimation & Plastisol: Technical management of heat-transfer processes ensuring handfeel integrity and dimensional stability across fabric weights.",
        ],
      },
      {
        id: "footwear",
        title: "FOOTWEAR",
        points: [
          "Component Integrity: Technical oversight of footwear anatomy — Leather, EVA, Rubber — for durability and slip resistance.",
          "Lasting & Bonding: Knowledge of cement construction and injection molding with focus on bonding strength and pull-test standards.",
          "Compliance Protocols: Test matrices for physical durability and chemical safety compliance across multi-market programs (casual and sport footwear).",
        ],
      },
      {
        id: "home-textiles",
        title: "HOME TEXTILES",
        points: [
          "Functional Durability: Specialized focus on light fastness, dimensional stability, and thread count verification for bedding and upholstery.",
          "Safety Standards: Implementation of fire-retardancy protocols and Oeko-Tex Standard 100 compliance across soft and hard home categories.",
          "Hard-Lines: Electronics accessories, gadgets, and kitchen utilities — test matrices built from zero for both soft and hard home categories.",
        ],
      },
    ],
  },
  {
    id: "process",
    label: "Process Speciality",
    tagline: "Systems that hold under volume, margin pressure, and geography.",
    color: "#22d3ee",
    bg: "radial-gradient(ellipse 90% 65% at 80% 20%, rgba(34,211,238,0.12) 0%, transparent 65%)",
    items: [
      {
        id: "prod-mgmt",
        title: "PRODUCTION OPERATIONS & PLANNING",
        points: [
          "Multi-Category Operational Integrity: Directed full-cycle production planning and capacity evaluation across Garments, Textiles, Footwear, Home Furnishings, and Fashion Accessories — ensuring zero factory overloading and 100% on-time delivery.",
          "Capacity & T&A Synchronization: Expert in T&A scheduling and SAM/SMV-based capacity mapping to align factory output with product complexity and resource availability.",
          "Cross-Functional Governance: Bridging the gap between merchandising, QA, and production floor teams through rigorous SOPs, Pre-Production Meetings (PPM), and pilot run governance.",
          "Commercial Costing & Merchandising: Deep expertise in full-cycle costing and cross-functional delivery coordination, ensuring margin protection and supply chain efficiency.",
          "On-Line Quality Systems: Implemented real-time visual management tools — Traffic Light Systems for hourly audits and Fishbone (Ishikawa) Evaluations for deep-dive root cause analysis on the production floor.",
          "Product Life Cycle Governance: Engineered comprehensive SOPs from fabric strike-off and handfeel approvals to monitoring detailed lab reports and providing commercial sign-offs.",
          "Strategic Risk Analysis: Conducted proactive risk identification and action planning, aligning production outputs with strict company standards and global quality benchmarks.",
          "Technical Protocols: Established and controlled inspection and testing protocols throughout the product life cycle — ensuring high-standard material performance and aesthetic consistency.",
          "Process Optimization: Transformed production environments from reactive firefighting to proactive fire prevention through documented action plans and standardized technical protocols.",
          "Vendor & Factory Management: 11+ years supervising quality excellence and vendor compliance, ensuring Gold Seal standards are replicable at bulk scale.",
        ],
      },
      {
        id: "supply-chain",
        title: "STRATEGIC SOURCING & VENDOR MANAGEMENT",
        points: [
          "Buying Agency Management at Scale: Orchestrated regional operations for A&F South Asia, overseeing 350+ professionals across quality, merchandising, and logistics to drive brand excellence and operational synergy.",
          "End-to-End Factory Onboarding: Directed the full vendor development lifecycle — 3P compliance audits, brand-standard visits, and structured induction training for new manufacturing partners.",
          "Risk-Based Order Allocation: Engineered a strategic allocation framework across multi-factory networks, leveraging proactive risk assessments to balance production loads and ensure consistent OTD performance.",
          "Strategic Vendor Development: Transformed supplier relationships into high-performing partnerships through continuous performance evaluation, capacity-building initiatives, and standardized global SOPs.",
        ],
      },
      {
        id: "vendor-audit",
        title: "QMS & COMPLIANCE INFRASTRUCTURE",
        points: [
          "Greenfield QMS Architecture (Snapdeal): Engineered end-to-end QMS for Snapdeal's private labels from the ground up — specialized test matrices, 3P lab protocols, and standardized warehouse quality infrastructure.",
          "Custom Inspection & Testing Frameworks: Developed proprietary technical inspection and product testing protocols governing both internal quality teams and 3PL labs, with clear difference checks and standardized SOPs.",
          "P&L-Linked Performance Governance: Enforced high-stakes vendor scorecard system where quality performance was directly tied to listing restrictions and commercial penalties for non-conformance.",
          "Global Compliance Stewardship (A&F / HQTS): Directed rigorous factory assessments ensuring 100% adherence to global safety, social, and technical standards across 50+ strategic partnerships.",
          "Systemic Risk Mitigation (CAPA): Spearheaded CAPA protocols transforming underperforming factories into high-quality, reliable manufacturing partners through structured technical intervention.",
        ],
      },
      {
        id: "risk-mitigation",
        title: "OPERATIONAL EXCELLENCE & RISK MITIGATION",
        points: [
          "Regional Risk & T&A Discipline: Managed T&A discipline across 50+ strategic partnerships with automated, risk-based escalation triggers to proactively mitigate milestone slips and safeguard OTD.",
          "Data-Driven Catalog Optimization: Analyzed Return Rates and NPS/Customer Ratings to introduce visual illustrations and enhanced size guides — significantly reducing consumer confusion and return volumes.",
          "Advanced Quality Gating: Established AQL Gating, DHU (Defects per Hundred Units), FTP (First Time Pass), and PPP (Projected Production Performance) for real-time manufacturing transparency.",
          "Lean Manufacturing & RCA: Deployed 5S, Poka-Yoke, and VSM on the factory floor. Leveraged Fishbone (Ishikawa), 5-Why, Pareto Charts, and FMEA to resolve systemic production bottlenecks.",
          "Global Regulatory & Security Compliance: Orchestrated CTPAT, SA8000, SEDEX, and GMP certifications ensuring 100% adherence to international labor, safety, and trade standards.",
          "Gemba-Led Continuous Improvement: Conducted regular Gemba Walks bridging executive strategy and shop-floor reality — ensuring technical protocols and improvements are sustained at the source of value.",
        ],
      },
    ],
  },
  {
    id: "standards",
    label: "Standards & ISO",
    tagline: "Global benchmarks and lead-auditor precision for absolute reliability.",
    color: "#e2e8f0",
    bg: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(226,232,240,0.07) 0%, transparent 65%)",
    items: [
      {
        id: "iso-9001",
        title: "ISO 9001:2015",
        points: [
          "Systemic QMS Architecture: Engineered and maintained robust Quality Management Systems based on ISO 9001:2015 — optimizing all processes from procurement to final dispatch for consistency and customer satisfaction.",
          "Continuous Improvement (PDCA): Leveraged the Plan-Do-Check-Act cycle to drive iterative improvements in manufacturing workflows, reducing process variability and enhancing operational transparency.",
          "Lead Auditor (BSI, 2019): Certification applied at floor level, not just for the certificate — systems thinking embedded in SOP design, audit protocols, and training programs.",
        ],
      },
      {
        id: "iso-17020",
        title: "ISO 17020 | SA8000 | SEDEX",
        points: [
          "Technical & Ethical Auditing: Expert in ISO 17020 requirements for inspection bodies — ensuring 3P and internal audits are conducted with absolute impartiality and technical competence.",
          "Social Compliance Leadership: Orchestrated factory-wide compliance with SA8000 and SEDEX (SMETA) standards — managing social accountability audits for ethical labor practices, health and safety, and environmental stewardship.",
          "Risk-Based Compliance: Conducted comprehensive gap analyses and CAPA implementation to move vendors from non-compliant to brand-authorized status across multi-country audit programs.",
        ],
      },
      {
        id: "lean",
        title: "LEAN SIX SIGMA & KAIZEN",
        points: [
          "Waste Elimination (Muda): Deployed Lean methodologies to identify and eliminate the 8 Wastes in production — significantly improving throughput and reducing lead times.",
          "Kaizen Culture: Facilitated Continuous Improvement workshops on the factory floor, empowering line-level teams to solve bottlenecks using 5S, Poka-Yoke (Mistake Proofing), and Value Stream Mapping (VSM).",
          "DMAIC Methodology: Applied Six Sigma's DMAIC framework (Define, Measure, Analyze, Improve, Control) to reduce defect rates and achieve high-precision First-Time Pass (FTP) yields.",
          "HQTS Consultancy Division: Built HQTS's LEAN, data-driven QMS, and CAPA consultancy division from scratch — supporting small and medium factories across South Asia.",
        ],
      },
      {
        id: "data",
        title: "DATA-DRIVEN QUALITY",
        points: [
          "Statistical Process Control (SPC): Utilized Pareto Charts, Trend Analysis, and Control Charts to monitor production health and predict quality shifts before they result in batch failures.",
          "Analytics-Led Decision Making: Integrated real-time floor data (DHU, AQL levels) into executive dashboards to drive informed resource allocation and risk-based order placement.",
          "Returns & NPS Correlation: Analyzed post-purchase data including Return Rates and NPS to identify technical product gaps and implement engineering fixes at the source.",
          "Vendor Scorecard Intelligence: Tied performance data directly to listing and allocation decisions — transforming quality metrics from a reporting tool into a commercial lever.",
        ],
      },
      {
        id: "iso-4416",
        title: "GMP & ISO 4416:1981",
        points: [
          "Good Manufacturing Practices (GMP): Enforced strict GMP standards across production and warehouse facilities — ensuring a sterile, organized, and safe environment for high-end product manufacturing.",
          "Technical Sizing Standardization: Deployed ISO 4416:1981 across global supplier networks to eliminate fit inconsistencies — applied across 300+ fashion suppliers to solve sizing return root causes.",
          "Protocol Engineering: Developed proprietary SOPs and testing matrices translating ISO requirements into actionable floor-level checklists ensuring 100% adherence to technical specifications.",
        ],
      },
    ],
  },
];

type CardItem = { id: string; title: string; points: string[] };
type CardData = (typeof CARD_DATA)[number];

/* ─── Accordion row ──────────────────────────────────────────────────── */
function SubItem({
  item,
  color,
  isOpen,
  onToggle,
}: {
  item: CardItem;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = isOpen || hovered;

  return (
    <motion.div layout className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-full py-4 text-left cursor-pointer"
      >
        <div className="flex items-center justify-between gap-4">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-200"
            style={{
              color: isOpen
                ? color
                : hovered
                ? "rgba(245,245,245,0.9)"
                : "rgba(245,245,245,0.42)",
            }}
          >
            {item.title}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 text-base leading-none"
            style={{ color: isOpen ? color : "rgba(255,255,255,0.18)" }}
          >
            +
          </motion.span>
        </div>

        {/* Expanding underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{ background: color, originX: 0 }}
          initial={false}
          animate={{ width: lit ? "100%" : 0 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0, y: -6 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.85 }}
            style={{ overflow: "hidden" }}
          >
            <ul
              className="space-y-2.5 pb-5 pt-2"
              style={{
                borderLeft: `2px solid ${color}35`,
                paddingLeft: "1.25rem",
              }}
            >
              {item.points.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm leading-[1.85]"
                  style={{ color: "rgba(245,245,245,0.58)" }}
                >
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: color + "90" }}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Card body (auto-height, layout-animated) ───────────────────────── */
function CardBody({ card }: { card: CardData }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <motion.div
      layout
      className="relative w-full border border-white/[0.07]"
      style={{ background: "#050505", zIndex: 10 }}
    >
      {/* Radial ambient — decorative, doesn't affect layout */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: card.bg }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content — padding, no overflow:hidden so layout animation grows freely */}
      <div className="relative z-10 p-5 md:p-12">
        {/* Header */}
        <motion.div layout className="mb-8">
          <div
            className="mb-4 h-px w-12"
            style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
          />
          <h3 className="font-serif text-2xl font-bold text-foreground/95 md:text-4xl">
            {card.label}
          </h3>
          <p className="mt-2 text-sm italic text-muted/50">
            &ldquo;{card.tagline}&rdquo;
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div layout>
          {card.items.map((item) => (
            <SubItem
              key={item.id}
              item={item}
              color={card.color}
              isOpen={openId === item.id}
              onToggle={() =>
                setOpenId((prev) => (prev === item.id ? null : item.id))
              }
            />
          ))}
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          layout
          className="mt-6 h-px opacity-[0.14]"
          style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */
export function ExpertiseCards() {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduce = useReducedMotion();

  const prev = () =>
    setActiveIdx((p) => (p - 1 + CARD_DATA.length) % CARD_DATA.length);
  const next = () =>
    setActiveIdx((p) => (p + 1) % CARD_DATA.length);

  return (
    <section
      id="expertise"
      className="min-h-screen w-full bg-background py-14 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">

        {/* Heading — left-aligned, matches Hero text edge */}
        <div className="mb-10">
          <SectionHeading title="EXPERTISE" />
        </div>

        {/* Card area */}
        <div className="relative">
          {/* Decorative stack peek — two thin slivers behind the active card */}
          <div
            className="absolute inset-x-3 inset-y-0 border border-white/[0.045]"
            style={{ background: "#040404", transform: "translateY(6px)", zIndex: 2 }}
          />
          <div
            className="absolute inset-x-5 inset-y-0 border border-white/[0.025] md:inset-x-6"
            style={{ background: "#030303", transform: "translateY(12px)", zIndex: 1 }}
          />

          {/* Active card with fade+slide transition */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={reduce ? {} : { opacity: 0, y: 22 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                exit={reduce ? {} : { opacity: 0, y: -18 }}
                transition={{ duration: 0.38, ease: "circOut" }}
              >
                <CardBody card={CARD_DATA[activeIdx]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation — in normal flow, moves down as card expands */}
        <div className="mt-8 flex items-center justify-center gap-4 md:mt-10 md:gap-5">
          <button
            onClick={prev}
            className="flex h-8 w-8 items-center justify-center border border-accent/20 text-lg text-accent/50 transition-colors hover:border-accent/55 hover:text-accent"
            aria-label="Previous card"
          >
            ‹
          </button>

          {CARD_DATA.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="h-px transition-all duration-300"
              style={{
                width: activeIdx === i ? 28 : 8,
                background:
                  activeIdx === i ? CARD_DATA[i].color : "rgba(212,175,55,0.22)",
              }}
              aria-label={`Card ${i + 1}: ${c.label}`}
            />
          ))}

          <button
            onClick={next}
            className="flex h-8 w-8 items-center justify-center border border-accent/20 text-lg text-accent/50 transition-colors hover:border-accent/55 hover:text-accent"
            aria-label="Next card"
          >
            ›
          </button>
        </div>

      </div>
    </section>
  );
}
