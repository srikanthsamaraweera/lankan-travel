import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono, Poppins, Roboto } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${poppins.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
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
            <nav className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <Link
                href="/"
                className="rounded-full px-3 py-2 transition hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="rounded-full px-3 py-2 transition hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              >
                About
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
