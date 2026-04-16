import type { Metadata } from "next";
import { Rubik, Roboto } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap", // ⬅️ Prevents render blocking
  preload: true,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap", // ⬅️ Prevents render blocking
  preload: true,
});

export const metadata: Metadata = {
  title: "Haile Hotel and Resorts",
  description: "Explore the beauty of Ethiopia through our branches",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rubik.variable} ${roboto.variable}`}>
      <head>
        {/* Preconnect to CDN */}
        <link rel="preconnect" href="https://cloud.haileresorts.com" />
        <link rel="dns-prefetch" href="https://cloud.haileresorts.com" />

        {/* Preload critical hero image */}
        <link
          rel="preload"
          as="image"
          href="/images/main-hero/hero1.webp"
          fetchPriority="high"
        />
      </head>
      <body className="bg-bg text-text font-[var(--font-rubik)] w-full">
        {children}
      </body>
    </html>
  );
}
