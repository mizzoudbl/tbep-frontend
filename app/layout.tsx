import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { ApolloWrapper } from '@/lib/apolloWrapper';
import { ViewTransitions } from 'next-view-transitions';
import NextTopLoader from 'nextjs-toploader';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Drug Target Discovery',
  description: 'Drug Target Discovery Platform for Homosapiens',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloWrapper>
          <NextTopLoader showSpinner={false} color='teal' />
          <ViewTransitions>
            <div className='min-h-screen flex flex-col justify-between'>
              <Navbar />
              <div className='container mx-auto p-4'>{children}</div>
              <Footer />
            </div>
          </ViewTransitions>
          <Toaster />
        </ApolloWrapper>
      </body>
    </html>
  );
}
