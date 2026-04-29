export const VED_CAREER_SECTIONS = [
  {
    id: "mectech",
    role: "Merchandiser",
    company: "Mectech Knitfabs Pvt. Ltd.",
    period: "Aug 2014 – Jan 2017",
    location: "Gurgaon, India",
    description:
      "Managed production timelines, sampling, T&A schedules, costing, and vendor negotiations. Handled end-to-end order execution for Next (UK) and Landmark Group / Babyshop (UAE & West Asia) — $4–5M business per brand. Cross-functional management across quality, production, and shipping. Built the operational instinct — brand requirements, people management, and delivery accountability — that underpins every subsequent quality role.",
  },
  {
    id: "geochem",
    role: "Senior Inspector / Dy Technical Manager",
    company: "Geo-Chem Laboratories Pvt. Ltd. (now Cotecna)",
    period: "Feb 2017 – Dec 2020",
    location: "Gurugram, India",
    description:
      "Joined as Quality Inspector; promoted to Senior Inspector within 6 months and then to Dy Technical Manager. Led a team of 12+ inspectors, coordinators, and report reviewers across India, Bangladesh, and China. Conducted audits and inspections across garments, home furnishing, leather goods, hard-line items, and electronics. Clients included Woolworths (footwear), Bel&Bo (garments), Amazon (hardline & home textiles), Mufti Fabrics, and Flipkart (electronics). Built SOPs, manuals, and training programs for inspectors, auditors, and client-facing sales teams.",
  },
  {
    id: "hqts",
    role: "Quality & Compliance Manager",
    company: "HQTS Group",
    period: "Dec 2020 – Nov 2021",
    location: "Gurugram, India",
    description:
      "Quality, Compliance, and Audit Head for the India office. Managed 30+ inspectors, supervisors, and technical managers across India, Pakistan, Sri Lanka, and Turkey — and extended reach to West Asia and the EU. Maintained ISO 17020 compliance. Ran social audits for clients including Bunzl (Sedex & SA8000 basis). Additionally built a consultancy division supporting manufacturing setups on LEAN implementation, Kaizen, data-driven QMS, RCA tools, and CAPA — a hands-on value-add for smaller factories that could not sustain an in-house quality function.",
  },
  {
    id: "snapdeal",
    role: "Manager – Quality Assurance",
    company: "Snapdeal",
    period: "Nov 2021 – Jun 2024",
    location: "Gurugram, India",
    description:
      "End-to-end QA/QC ownership for India's fashion marketplace and its owned labels. Marketplace phase: improved platform quality for lakhs of sellers — reduced customer return ratios from 18% to 7.8% using data-driven strategies, factory audits, DQA training, and SOP implementation. Private-label phase: built the quality, audit, and compliance department from zero across garments, footwear, homes (hard & soft), electronics accessories, fashion accessories, and cosmetics — test matrices, warehouse QMS, 3P lab protocols, and a vendor scorecard tied to P&L. Team: 15+ QAs and QCs across domains. Achieved private-label bad ratings of 8–10% vs. platform average of 15–18%.",
    achievement: "18% → 7.8%",
    achievementLabel: "Return Rate",
  },
  {
    id: "anf",
    role: "Senior Quality Specialist",
    company: "Abercrombie & Fitch Co.",
    period: "Jul 2024 – Present",
    location: "Gurugram, India",
    description:
      "South Asia quality gate for a $180–200M program — 25–30M units across 20+ India, 15+ Sri Lanka, and 15+ Bangladesh factory partnerships. Manages vendor, factory, and buying-agent networks; oversees 350+ dedicated brand staff (quality & tech) through agents. Product scope: women's fashion, men's wear, kids fashion, outerwear, footwear, belts, bags, caps, and accessories. Drives factory assessments, capacity evaluations, compliance reviews, CAPA, new-factory onboarding, and advanced floor controls (laser-guided layout for stripes & checks, button attachment jigs, DHU / FTP / PPP systems). No major end-customer incidents on programs delivered from these regions. Machate Raho Award 2024 (Acevector Ltd.).",
    achievement: "$180–200M",
    achievementLabel: "Business Volume",
  },
];

/** Evidence-first metrics — no generic "expertise" labels. */
export const VED_IMPACT_METRICS = [
  { value: "30M+", label: "Units in Flow", sub: "Regional program volume" },
  { value: "50+", label: "Factory Footprint", sub: "India, BD, LKA, active gates" },
  { value: "$200M+", label: "A&F South Asia", sub: "P&L you align to quality" },
  { value: "7.8%", label: "Floor Return Rate", sub: "From 18% at Snapdeal fashion" },
];

export type FitWorldId = "gqd" | "process" | "xborder";

export const VED_FIT_ROLES: {
  id: FitWorldId;
  title: string;
  headline: string;
  why: string;
  evidence: string;
  mapSkills: string[];
}[] = [
  {
    id: "gqd",
    title: "Global Quality Director",
    headline: "$200M in motion · 30M+ units · 50+ active factory gates",
    why: "The role is not a chart — it is gate discipline across India, Sri Lanka, and Bangladesh at the same P&L rhythm.",
    evidence:
      "South Asia: ~25–30M units, 20+ India / 15+ Bangladesh / 15+ Sri Lanka partners, with buying-agent ecosystems (~350+ people) aligned to one brand bar. You get someone who has already run that plane — with zero major end-customer incidents on the programs delivered from these regions in role.",
    mapSkills: [
      "Unit + T&A control",
      "AQL + inline / final",
      "Capacity gating",
      "Agent alignment",
    ],
  },
  {
    id: "process",
    title: "Process Consultant (Lean / Kaizen)",
    headline: "Build the division when there is no template — from PL gate to WMS",
    why: "Private label at scale means standing up the quality org before the first carton ships: protocols, test matrices, and warehouse QMS with almost no negotiating leverage on MOQ.",
    evidence:
      "From Snapdeal's owned-label program: built inspection and test protocols, warehouse QMS, and vendor scorecard discipline from fashion through footwear, home, electronics accessories, fashion accessories, and cosmetics — cross-functional, data-led, and vendor-facing every week.",
    mapSkills: [
      "Kaizen / line balance",
      "QMS from zero",
      "SOP + gate maps",
      "30+ QAs & QCs + WHS",
    ],
  },
  {
    id: "xborder",
    title: "Cross-Border Operations Lead",
    headline: "One calendar · Turkey, China, Pakistan, EU, South Asia",
    why: "Operations leadership here is time-zone and culture arbitrage: audits, escalations, and the same AQL language on every site.",
    evidence:
      "Geo-Chem (2017–2020): inspection teams in India, Bangladesh, and China across garments, leather, hard-lines, and electronics. HQTS (2020–2021): India, Pakistan, Sri Lanka, Turkey, West Asia, and EU — 30+ staff, ISO 17020, and social compliance audits (Bunzl / Sedex / SA8000). A&F: 50+ factories across three countries, 350+ agent headcount, single brand quality bar. That is the cross-border mesh this role is built for.",
    mapSkills: [
      "SEDEX / SA8000",
      "Regulatory file",
      "Roster + TAT",
      "3P lab alignment",
    ],
  },
];

export const VED_FIT_NARRATIVE_ROLES = [
  {
    title: "Operations Excellence Lead",
    detail:
      "11 years of Kaizen and Lean Six Sigma in high-pressure manufacturing — not process theater, but line-level DHU, FTP, PPP measurement and real flow discipline.",
  },
  {
    title: "Regional Quality Head (APAC)",
    detail:
      "India, Pakistan, Sri Lanka, Turkey, Bangladesh, and China: managing diverse teams, buying agents, and cultures under one quality bar. Open to global leadership and relocation including Australia.",
  },
  {
    title: "Brand Protection Specialist",
    detail:
      "CTPAT, SA8000, SEDEX-facing programs, ISO 9001:2015 Lead Auditor (BSI, 2019) — integrity maintained for A&F, e-commerce marketplace platforms, and hardline / fashion programs.",
  },
] as const;

export const VED_MILESTONES = [
  {
    label: "Education",
    name: "Diploma in Apparel & Textiles — UPTU (2011–2014)",
    context: "Fiber, yarn, weave structures, garment manufacturing — the technical base every quality decision rests on",
  },
  {
    label: "Certification · Lead Auditor",
    name: "ISO 9001:2015 Lead Auditor — BSI (2019)",
    context: "Systems thinking applied at floor level, not just for the certificate",
  },
  {
    label: "Award · Milestone of Excellence",
    name: "Machate Raho — Acevector Ltd. (A&F, 2024)",
    context: "Sustained execution under global retail pressure",
  },
  {
    label: "Regional Leadership",
    name: "40+ QAs & Supervisors across Asia",
    context: "India, Pakistan, Sri Lanka, Turkey, Bangladesh, China — field org design, not matrix slides",
  },
] as const;

export const VED_CRAFT_STRUCTURES: { name: string; body: string }[] = [
  {
    name: "Jacquard",
    body: "Per-end warp (and often weft) selection for figure and repeat control — the architecture behind complex face / back relationships and high-definition garment surfaces. Risk: mis-tie or harness drift shows as pattern ghosting; mitigation is stop-level clarity and beam tension discipline.",
  },
  {
    name: "Dobby",
    body: "Limited mechanical patterning — a controlled step between plain and Jacquard. The sweet spot for small repeats, dobby laces, and engineered stripes where you still need line speed. Often paired with color and yarn engineering before finishing.",
  },
  {
    name: "Honeycomb",
    body: "Waffle / cell geometry for loft and wicking. Common in performance layers where hand-feel and moisture must hold after wash. Construction drives finishing chemistry more than you would expect for such a simple look.",
  },
];

export const VED_CRAFT_PRINTING_ARC =
  "Color starts as block and tie-dye: manual repeat and batch variance. The ladder moves to screen (mesh tension, squeegee pressure) and on to digital: shorter runs, but file integrity, jet maintenance, and fabric pretreatment become the new AQL. Garment build then has to line up: seam, trim, and construction choices either honor that print or expose it in the fit room.";

/** Fiber node — tap-to-reveal: yarn and spinning layer */
export const VED_CRAFT_YARN_SPUN =
  "Yarn is where twist level, neps, and TPI meet lot discipline: a defect encoded here propagates as skew in knitting or slip in woven harness timing. Open-end vs ring, compact vs combed, draw ratio — the lab calls are not academic when the line is at 0.2 DPU. Spinning choices lock in the band that finishing can repair — or not.";

/** Scale node — "spec sheet" key figures */
export const VED_SPEC_SHEET_ROWS: { k: string; v: string }[] = [
  { k: "Unit throughput (A&F South Asia, indicative)", v: "25-30M units / yr program band" },
  { k: "P&L band aligned in role", v: "$180-200M | A&F South Asia" },
  { k: "Factory network", v: "50+ active partnerships (IN | BD | LKA)" },
  { k: "Agent + dedicated brand headcount (field)", v: "350+ (buying agent, quality & tech)" },
  { k: "A&F regional factory oversight (indicative)", v: "20+ India | 15+ Bangladesh | 15+ Sri Lanka" },
  { k: "Product categories (A&F South Asia)", v: "Women's fashion | Men's wear | Kids | Outerwear | Footwear | Fashion accessories" },
  { k: "Snapdeal fashion return rate improvement", v: "18% to 7.8% | Nov 2021 - Jun 2024" },
  { k: "Vendor / factory management experience", v: "15+ Vendors | 40+ Factories across Asia" },
];

export const VED_FIT_KEY_STATS = [
  { value: "30M+", label: "Units" },
  { value: "$200M+", label: "Program band" },
  { value: "50+", label: "Factories" },
] as const;

export const VED_LOGIC_PRIVATE_LABEL =
  "At Snapdeal, the work ran in two phases. The first was marketplace-wide: reading customer ratings, return rates, and NPS data for lakhs of sellers, then digging causes — image accuracy, description quality, physical product compliance — and deploying CAP across cross-functional teams. The result: customer return ratios reduced from 18% to 7.8% in fashion. The second phase was entirely new territory: Snapdeal started its own labels across garments, then footwear, then homes (hard and soft), electronics accessories, fashion accessories, and cosmetics. No inherited template existed. Test matrices, inline / mid / final protocols, warehouse QMS, 3P lab coordination, and vendor negotiations had to be invented under volume and margin pressure. The team: six QA / deputy managers, five to six QCs, ten to twelve warehouse QCs. Private-label bad ratings held at 8–10% against the platform average of 15–18%. The program ran until the company shut the owned-labels business.";

export const VED_ANF_FIELD_CONTROLS: { title: string; body: string }[] = [
  {
    title: "Laser-guided layout for stripes and checks",
    body: "Laser alignment gives the line a physical datum to cut twist and bow before spreading — critical when the brand is selling pattern integrity across women's fashion and men's checks.",
  },
  {
    title: "Button attachment, placement, and pull strength",
    body: "Jigs, templates, and controlled torque ensure attachment order and sit lines match spec. A quiet failure mode that becomes a returns driver on rush orders when left unchecked.",
  },
  {
    title: "Label and size integrity",
    body: "Mismatches between neck, bundle, and pack labels are a pure defect class. Controlled verification loops against measurement tables reduce wrong-unit exposure across India, Sri Lanka, and Bangladesh shipments.",
  },
  {
    title: "DHU / FTP / PPP floor measurement",
    body: "Advanced production quality measurement systems — Defects per Hundred Units, First Time Pass, and Points Per Product — used to track line efficiency and trigger early intervention before final inspection.",
  },
  {
    title: "Embellishment, embroidery, and printing evaluation",
    body: "Technique-level risk assessment for embellishments, embroidery placements, and print quality — evaluating hand, wash durability, and regulatory safety compliance per category requirements.",
  },
  {
    title: "New factory onboarding — assessment to allocation",
    body: "Third-party audit followed by brand-visit final approval, onboard training, and risk-based allocation planning. Capacity evaluations run regularly to avoid overloading any single gate and ensure hustle-free deliveries.",
  },
];
