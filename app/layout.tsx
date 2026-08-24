import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pooja-chaudhary-portfolio.checkingtest110125.chatgpt.site"),
  title: "Pooja Chaudhary — Actor | Film & Music Video",
  description:
    "The cinematic acting portfolio of Pooja Chaudhary — film and music video performer, and Registered Nurse in Australia.",
  applicationName: "Pooja Chaudhary Portfolio",
  keywords: ["Pooja Chaudhary", "actor", "Nepali film", "music video", "portfolio", "Australia"],
  other: {
    "codex-preview": "development",
  },
  openGraph: {
    title: "Pooja Chaudhary — Actor",
    description: "Film, music video and screen work by Pooja Chaudhary.",
    type: "website",
    url: "https://pooja-chaudhary-portfolio.checkingtest110125.chatgpt.site",
    siteName: "Pooja Chaudhary Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Pooja Chaudhary — Actor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pooja Chaudhary — Actor",
    description: "Film, music video and screen work by Pooja Chaudhary.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
