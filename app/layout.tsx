import type { Metadata } from "next";
import { Fira_Code as FiraCode } from "next/font/google";
import "./globals.css";

const firaCode = FiraCode({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "jspen",
  description: "JS to console playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={firaCode.variable}>
      <body>{children}</body>
    </html>
  );
}