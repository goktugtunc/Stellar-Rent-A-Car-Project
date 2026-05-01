import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StellarRent — Blockchain Araba Kiralama",
  description:
    "Freighter cüzdanınızla Stellar ağı üzerinden XLM ödeyerek araç kiralayın.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
