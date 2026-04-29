"use client";
import { useState, useCallback } from "react";

import { ParticleCanvas } from "@/components/background/ParticleCanvas";
import { CurtainLanding } from "@/components/sections/CurtainLanding";
import { GlassNavbar } from "@/components/ui/GlassNavbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExpertiseCards } from "@/components/sections/ExpertiseCards";
import { TransformationSection } from "@/components/sections/TransformationSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { MarketExposureSection } from "@/components/sections/MarketExposureSection";
import { FitInSection } from "@/components/sections/FitInSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/ui/Footer";

export function PortfolioCanvas() {
  const [curtainLifted, setCurtainLifted] = useState(false);
  const handleLift = useCallback(() => setCurtainLifted(true), []);

  return (
    <main className="cinematic-typography relative">
      {/* Stage 0 — obsidian curtain */}
      <CurtainLanding onLift={handleLift} />

      {/* Ambient particle canvas (fixed) */}
      <ParticleCanvas />

      {/* Glassmorphism navbar */}
      <GlassNavbar visible={curtainLifted} />

      {/* 1 — Hero: image LEFT · name + title RIGHT */}
      <HeroSection curtainLifted={curtainLifted} />

      {/* 2 — About / Summary: journey text LEFT · image gallery RIGHT */}
      <AboutSection />

      {/* 3 — Expertise: click-driven Z-stack (Product / Process / Standards) */}
      <ExpertiseCards />

      {/* 4 — Transformation Timeline: 2017 → 2024 vertical scroll */}
      <TransformationSection />

      {/* 5 — Impact: animated counters + defect rate drop */}
      <ImpactSection />

      {/* 6 — Market Exposure: interactive world map + brand partners */}
      <MarketExposureSection />

      {/* 7 — Fit-in: role selector + description */}
      <FitInSection />

      {/* 8 — Contact: 3D tilt form */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
