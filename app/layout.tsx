import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tableau Lineage Visualizer",
  description: "Visualize Tableau workbook calculated field dependencies",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%230ea5e9;stop-opacity:1"/><stop offset="100%" style="stop-color:%2322c55e;stop-opacity:1"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(%23grad)"/><text x="50" y="70" font-family="system-ui,-apple-system,sans-serif" font-size="48" font-weight="700" fill="white" text-anchor="middle">TL</text><circle cx="25" cy="25" r="4" fill="white" opacity="0.8"/><circle cx="75" cy="25" r="4" fill="white" opacity="0.8"/><circle cx="50" cy="35" r="3" fill="white" opacity="0.6"/><line x1="25" y1="25" x2="50" y2="35" stroke="white" stroke-width="1.5" opacity="0.5"/><line x1="75" y1="25" x2="50" y2="35" stroke="white" stroke-width="1.5" opacity="0.5"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}