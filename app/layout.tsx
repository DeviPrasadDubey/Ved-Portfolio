import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ved Prakash Dwivedi — Quality & Supply Chain Leader",
  description:
    "Global Quality & Supply Chain Leader. 11+ years. $200M+ business. 30M+ units. Abercrombie & Fitch, Snapdeal, HQTS.",
  keywords: [
    "quality assurance",
    "supply chain",
    "apparel",
    "South Asia",
    "Abercrombie Fitch",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
