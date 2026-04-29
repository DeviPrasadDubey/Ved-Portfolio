export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  readTime: string;
  publishedAt: string;
  featured: boolean;
  themeColor?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "art-of-zero-defects",
    title: "The Art of Zero Defects",
    excerpt:
      "How precise quality management frameworks eliminate defects before they reach the production floor — and why it starts with the loom, not the loading dock.",
    category: "Quality Management",
    readTime: "6 min read",
    publishedAt: "2024-09-15",
    featured: true,
    themeColor: "#c9a44c",
    content: [
      "In the high-volume garment industry, a 1% defect rate translates to hundreds of thousands of units returned — and billions in cumulative brand erosion. Zero defects is not a fantasy. It is an engineering problem.",
      "At Abercrombie & Fitch, managing 40+ vendor factories across South Asia, the challenge was systemic. Each factory interpreted standards differently, ran different machinery calibration tolerances, and had its own informal definition of 'acceptable.'",
      "The solution was a three-layer inspection protocol: AQL fabric sampling at the greige stage, inline inspection at the cutting room, and pre-shipment audit at packing. Each layer caught distinct defect typologies. Together, they reduced the escape rate to under 0.3%.",
      "Lean Six Sigma provided the statistical backbone — DPMO calculations, Xbar-R control charts, and process capability indices (Cpk) transformed subjective quality perception into objective, measurable, auditable outcomes.",
      "The real insight was not procedural but cultural: quality must be rewarded upstream, not punished downstream. Factories that caught defects early earned faster approvals and better program allocations. That incentive structure changed everything.",
    ],
  },
  {
    slug: "snapdeal-returns-story",
    title: "From 18% to 7.8%: A Returns Story",
    excerpt:
      "Cutting fashion return rates by more than half through systematic quality benchmarking, vendor accountability, and a fundamental rethink of what 'accurate product description' means.",
    category: "Case Study",
    readTime: "8 min read",
    publishedAt: "2024-11-02",
    featured: true,
    themeColor: "#3a7bd5",
    content: [
      "When I joined Snapdeal's quality assurance division, the fashion category carried an 18% return rate. In e-commerce, returns are the silent profit killer — reverse logistics, restocking, customer service, and markdown losses compound with every returned package.",
      "The first audit revealed that 64% of returns cited 'not as described' — a sizing and colour consistency problem, not a manufacturing defect. The root cause was misaligned vendor photo shoots combined with uncalibrated size charts that varied by as much as 3cm between suppliers.",
      "We implemented a three-pronged intervention: standardised size measurement protocols (ISO 4416:1981 as the baseline), a digital colour-matching system using physical swatch libraries for photography, and quarterly vendor scorecards tied directly to listing privileges.",
      "The scorecard model created accountability where none had existed. Vendors with recurring size non-conformances were moved to enhanced inspection tiers. Repeat offenders lost preferred placement. Top performers earned faster approval cycles.",
      "Within 18 months, the return rate dropped to 7.8%. With each returned item costing approximately ₹180 in reverse logistics, the reduction represented tens of crores in direct savings — and an immeasurable improvement in customer trust.",
      "The lesson extended far beyond fashion: quality is not just a manufacturing problem. It is an information fidelity problem. When the product description matches physical reality precisely, customers do not return products.",
    ],
  },
  {
    slug: "jacquard-to-just-in-time",
    title: "From Jacquard to Just-in-Time",
    excerpt:
      "Understanding complex weave structures — from Dobby to Jacquard — and how fabric construction directly impacts supply chain velocity and sourcing strategy.",
    category: "Textile Science",
    readTime: "7 min read",
    publishedAt: "2025-01-18",
    featured: false,
    content: [
      "The Jacquard loom was the first programmable machine — a mechanical computer that predated Babbage by decades. Its modern descendant remains one of the most complex manufacturing systems in apparel. Understanding its intricacies is the foundation of quality in woven luxury goods.",
      "Jacquard weaving allows individual warp thread control, enabling complex patterns, textures, and pile structures impossible with dobby or plain weave equipment. For A&F's heritage flannel and oxford cloth programs, this meant deep collaboration with weavers in Punjab and Tamil Nadu to maintain construction integrity across seasonal repeats.",
      "The challenge in supply chain is that Jacquard fabrics carry longer production lead times — typically 35–45 days versus 20 days for basic constructions. This directly impacts just-in-time replenishment models and requires upstream planning discipline.",
      "Dobby constructions offer a middle ground: more texture and structure than plain weave, shorter lead times than Jacquard, and easier quality control. The weave repeat is controlled mechanically rather than through individual thread selection, which reduces calibration failure modes.",
      "The solution for A&F's seasonal programs was a fabric library — a standardised collection of pre-approved constructions at key vendor mills that could be activated without the standard sampling and approval cycle. This reduced time-to-market from 90 days to 58 days for repeat programs, freeing design bandwidth for genuinely new development.",
    ],
  },
  {
    slug: "vendor-selection-south-asia",
    title: "The Science of Vendor Selection in South Asia",
    excerpt:
      "A systematic, 280-point approach to onboarding and auditing factory partners across Bangladesh, India, Sri Lanka, and Cambodia.",
    category: "Operations",
    readTime: "5 min read",
    publishedAt: "2025-03-05",
    featured: false,
    content: [
      "South Asia produces approximately 45% of the world's garment exports. Within this landscape, vendor selection is both art and science — balancing cost competitiveness against quality capability, lead time reliability, and ethical compliance.",
      "HQTS Group's methodology centres on a 280-point factory audit framework covering four domains: Infrastructure & Equipment (machine age, maintenance logs, calibration records), Human Capital (workforce size, skill certification, turnover rates), Quality Systems (SOP documentation, corrective action records, lab equipment), and Compliance (labour laws, fire safety, environmental certifications).",
      "The most predictive indicator of future quality performance is the corrective action response rate — factories that document, assign ownership to, and close non-conformances within 30 days consistently outperform those that do not, regardless of initial audit score. This single metric has a 0.78 correlation with 12-month defect rates in our historical data.",
      "Capacity assessment is equally critical and frequently underweighted. A factory that can produce 50,000 units per month cannot reliably serve a 70,000-unit monthly program without quality degradation — even with impeccable systems. Matching program volume to verified capacity is non-negotiable.",
      "Over 11 years and 200+ audits across Bangladesh, India, Sri Lanka, and Cambodia, the pattern is consistent: quality is a culture, not a checklist. The audit score tells you where a factory is today. The corrective action culture tells you where it will be in two years.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
