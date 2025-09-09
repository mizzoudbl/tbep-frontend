import { DocsThemeLayout } from '@/theme.config';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DocsThemeLayout>{children}</DocsThemeLayout>;
}
