import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tableau Lineage Visualizer",
  description: "Visualize Tableau workbook calculated field dependencies",
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