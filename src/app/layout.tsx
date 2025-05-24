import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Using Geist Sans as requested
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { APIProviderWrapper } from '@/components/map/api-provider-wrapper';
import { BookmarkProvider } from '@/context/bookmark-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Geist Mono is available if needed, but primary font is sans-serif
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Eis für Pfoten',
  description: 'Finde hundefreundliches Eis in deiner Nähe!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} antialiased flex flex-col min-h-screen`}>
        <APIProviderWrapper>
          <BookmarkProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Toaster />
          </BookmarkProvider>
        </APIProviderWrapper>
      </body>
    </html>
  );
}
