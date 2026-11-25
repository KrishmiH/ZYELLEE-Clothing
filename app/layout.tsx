import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZYELLEE | Thoughtful Everyday Clothing",
  description:
    "Discover thoughtful everyday clothing made for effortless wear. Explore the latest collection from ZYELLEE.",
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
