import type { Metadata } from "next";
import { Lexend, Work_Sans } from "next/font/google";
import "./globals.css";
import AllProviders from "./(providers)";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Property Plant & Equipment Tracking System",
  description: "Track and monitor assets with accountability.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${workSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
