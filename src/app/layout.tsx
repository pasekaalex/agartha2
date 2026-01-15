import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGARTHA2",
  description: "they went deeper",
  openGraph: {
    title: "AGARTHA2",
    description: "they went deeper",
  },
  twitter: {
    card: "summary",
    title: "AGARTHA2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
