import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGARTHA2 - The Sequel From Below | pump2",
  description: "They went deeper. The underground civilization that THEY don't want you to know about is back with AGARTHA2 on pump2. Vril energy. Hollow Earth. 100x guaranteed (not financial advice (it is)).",
  keywords: ["agartha", "agartha2", "pump2", "memecoin", "solana", "hollow earth", "vril", "underground"],
  openGraph: {
    title: "AGARTHA2 - THEY WENT DEEPER",
    description: "The beings below have returned. pump2 exclusive. vril powered.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGARTHA2 - The Sequel From Below",
    description: "pump1 was the surface. pump2 goes DEEPER.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="vril-bg scanlines">
        {children}
      </body>
    </html>
  );
}
