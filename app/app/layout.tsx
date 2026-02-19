import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accattafy - Find the Best Deals on Fashion & Sportswear",
  description: "Discover amazing discounts on Nike, Adidas, Puma, and more. Swipe through deals, save your favorites, and never miss a sale.",
  other: {
    'impact-site-verification': '75c2621b-b26b-4364-99da-4e78fe652315',
  },
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
        <script src="https://pl28747575.effectivegatecpm.com/0c/aa/26/0caa2604a0dd1d4e4014d503b8013fee.js" async></script>
        <script async data-cfasync="false" src="https://pl28747422.effectivegatecpm.com/1af0909c77fd1bfd1dbc81df6407a7ed/invoke.js"></script>
      </body>
    </html>
  );
}
