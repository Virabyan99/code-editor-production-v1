import type { Metadata } from "next";
import { Fira_Code as FiraCode } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes';

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
    <html lang="en" suppressHydrationWarning className={firaCode.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}