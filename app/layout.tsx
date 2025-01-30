import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ApolloWrapper } from '@/lib/apolloWrapper';
import { envURL } from '@/lib/utils';
import { GoogleAnalytics } from '@next/third-parties/google';
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
  title: 'Target & Biomarker Exploration Portal',
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
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html:
              '<script async src="https://tally.so/widgets/embed.js"></script><script>window.TallyConfig = {"formId": "wLvX0J","popup":{"open":{"trigger": "exit"},"showOnce": true,"doNotShowAfterSubmit": true,"autoClose": 0}};</script>',
          }}
        />
        <ApolloWrapper>
          <NextTopLoader showSpinner={false} color='teal' />
          <ViewTransitions>
            <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
          </ViewTransitions>
          <Toaster />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-5EEGNR6YNF'} />
        </ApolloWrapper>
      </body>
    </html>
  );
}
