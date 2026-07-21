import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mabenneenligne.fr"),
  title: { default: "MaBenneEnLigne — Location de benne partout en France", template: "%s | MaBenneEnLigne" },
  description: "Louez votre benne en 2 minutes. Livraison sous 24 à 48h, prix tout compris et réseau de transporteurs certifiés partout en France.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_FR", siteName: "MaBenneEnLigne", title: "MaBenneEnLigne", description: "Votre benne livrée en 24h, partout en France.", images: [{ url: "/og.png", width: 1792, height: 1024, alt: "MaBenneEnLigne — Votre benne livrée en 24h" }] },
  twitter: { card: "summary_large_image", title: "MaBenneEnLigne", description: "Votre benne livrée en 24h, partout en France.", images: ["/og.png"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0F2B46" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
