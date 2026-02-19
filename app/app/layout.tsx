import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromoFinder - Find the Best Deals on Fashion & Sportswear",
  description: "Discover amazing discounts on Nike, Adidas, Puma, and more. Your go-to platform for finding the best deals on fashion and sportswear.",
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
