import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ApolloWrapper } from '@/lib/apolloWrapper';
import { envURL } from '@/lib/utils';
import './globals.css';
import { DocsThemeHead, DocsThemeLayout } from '@/theme.config';

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
  title: {
    default: 'Target & Biomarker Exploration Portal',
    template: '%s | Docs - TBEP',
  },
  applicationName: 'Target & Biomarker Exploration Portal',
  generator: 'Next.js',
  appleWebApp: {
    capable: true,
    title: 'Target & Biomarker Exploration Portal',
    statusBarStyle: 'black-translucent',
  },
  metadataBase: new URL(envURL(process.env.NEXT_PUBLIC_SITE_URL)),
  description: 'Drug Target Discovery Platform for Homosapiens',
  creator: 'Bhupesh Dewangan',
  keywords: 'TBEP, Drug Target, Biomarker, Homosapiens, Drug Discovery, Target Discovery, Biomarker Discovery',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: envURL(process.env.NEXT_PUBLIC_SITE_URL),
    siteName: 'Target & Biomarker Exploration Portal',
    title: 'Target & Biomarker Exploration Portal',
    description: 'Drug Target Discovery Platform for Homosapiens',
    images: {
      url: `${envURL(process.env.NEXT_PUBLIC_SITE_URL)}/image/open-graph.png`,
      width: 1200,
      height: 630,
      alt: 'Target & Biomarker Exploration Portal',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <DocsThemeHead />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloWrapper>
          <NextTopLoader showSpinner={false} color='teal' />
          <Toaster />
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
          )}
          <TooltipProvider delayDuration={100}>
            <DocsThemeLayout>{children}</DocsThemeLayout>
          </TooltipProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
