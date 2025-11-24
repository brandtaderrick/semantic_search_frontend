import type { Metadata } from "next";
import { Inter, Space_Grotesk, Orbitron, JetBrains_Mono} from "next/font/google";
import "./globals.css";

// Main font for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


const orbitron = Orbitron({
    subsets: ["latin"],
    variable: "--font-orbitron",
  });

// Display font for logo and headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});


export const metadata: Metadata = {
  title: "Semantic Search - Legacy Code Onboarding",
  description: "AI-powered semantic search for legacy codebases. Reduce onboarding time and understand complex code faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
