import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ApolloWrapper } from '@/lib/apolloWrapper';
import { ViewTransitions } from 'next-view-transitions';
import NextTopLoader from 'nextjs-toploader';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  preload: true,
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  preload: true,
});

export const metadata: Metadata = {
  title: 'TBEP',
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
            <TooltipProvider>{children}</TooltipProvider>
          </ViewTransitions>
          <Toaster />
        </ApolloWrapper>
      </body>
    </html>
  );
}
