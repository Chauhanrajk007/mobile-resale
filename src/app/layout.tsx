import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import PwaRegister from "@/components/PwaRegister";

const inter = Inter({ subsets: ["latin"], variable: "--font" });

export const metadata: Metadata = {
  title: "CheckMyPhone",
  description: "Professional Phone Inspection Reports",
};

const themeInit = `
  try {
    if (localStorage.getItem('cmp-theme') === 'dark' || (!('cmp-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={inter.variable}>
        <Nav />
        <main style={{ paddingBottom: '80px', paddingTop: '64px', minHeight: '100vh' }}>
          {children}
        </main>
        <PwaRegister />
      </body>
    </html>
  );
}
