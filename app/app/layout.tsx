import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accattafy - Find the Best Deals on Fashion & Sportswear",
  description: "Discover amazing discounts on Nike, Adidas, Puma, and more. Swipe through deals, save your favorites, and never miss a sale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
