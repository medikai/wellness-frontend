//src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppLayout } from '@/modules/layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { FontSizeProvider } from '@/contexts/FontSizeContext';
import { ClassProvider } from '@/contexts/ClassContext';
import { QuizProvider } from '@/contexts/QuizContext';
import { ReduxProvider } from '@/store/ReduxProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "waylness - Your Health Companion",
  description: "A comprehensive health and waylness platform designed for elderly care, featuring live classes, progress tracking, and personalized support.",
  keywords: ["health", "waylness", "elderly care", "fitness", "medical", "healthcare"],
  authors: [{ name: "waylness Team" }],
  openGraph: {
    type: "website",
    siteName: "waylness",
    title: "waylness - Your Health Companion",
    description: "A comprehensive health and waylness platform designed for elderly care",
  },
  twitter: {
    card: "summary",
    title: "waylness - Your Health Companion",
    description: "A comprehensive health and waylness platform designed for elderly care",
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
        <meta name="application-name" content="waylness" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        {process.env.NODE_ENV === "development" && (
          <>
            <meta
              httpEquiv="Content-Security-Policy"
              content="
        default-src 'self' blob: data: https: ws: wss:;
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https:;
        img-src 'self' data: blob: https:;
        connect-src 'self' https: wss:;
        font-src 'self' data: https:;
        media-src 'self' blob:;
        frame-src 'self' https:;
      "
            />
            <meta httpEquiv="Permissions-Policy" content="camera=(self), microphone=(self)" />
          </>
        )}

      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
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
        </ReduxProvider>
      </body>
    </html>
  );
}
