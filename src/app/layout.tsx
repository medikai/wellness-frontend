import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppLayout } from '@/modules/layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { FontSizeProvider } from '@/contexts/FontSizeContext';
import { ClassProvider } from '@/contexts/ClassContext';
import { QuizProvider } from '@/contexts/QuizContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wellness - Your Health Companion",
  description: "A comprehensive health and wellness platform designed for elderly care, featuring live classes, progress tracking, and personalized support.",
  keywords: ["health", "wellness", "elderly care", "fitness", "medical", "healthcare"],
  authors: [{ name: "Wellness Team" }],
  openGraph: {
    type: "website",
    siteName: "Wellness",
    title: "Wellness - Your Health Companion",
    description: "A comprehensive health and wellness platform designed for elderly care",
  },
  twitter: {
    card: "summary",
    title: "Wellness - Your Health Companion",
    description: "A comprehensive health and wellness platform designed for elderly care",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Basic Meta Tags */}
        <meta name="application-name" content="Wellness" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <FontSizeProvider>
            <ClassProvider>
              <QuizProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </QuizProvider>
            </ClassProvider>
          </FontSizeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
