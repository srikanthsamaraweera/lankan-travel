import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import HeaderNav from "./HeaderNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Lankan.org Travel Highlights",
  description:
    "Fresh travel stories from Lankan.org, curated for wanderers planning their next Sri Lankan journey.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Sri Lankan Vacations",
    url: "https://travel.lankan.org",
    logo: "https://travel.lankan.org/srilankan_vacations_logo.png",
    description: "Your ultimate guide to Sri Lanka travel, news, and itineraries.",
    parentOrganization: {
      "@type": "NewsMediaOrganization",
      name: "Lankan.org",
      url: "https://www.lankan.org",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${poppins.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-white/90 backdrop-blur">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
            >
              <Image
                src="/srilankan_vacations_logo.png"
                alt="Srilankan.vacations logo"
                width={44}
                height={44}
                className="rounded-full shadow-sm shadow-[var(--accent)]/20"
                priority
              />
              <span>Srilankan.vacations</span>
            </Link>
            <HeaderNav />
          </div>
        </header>
        {children}
        <footer className="border-t border-[var(--border-soft)] bg-white/90">
          <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-6 text-sm text-[var(--muted)] lg:px-10">
            <span className="text-center">
              © {year} Lankan.org — All rights reserved.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
