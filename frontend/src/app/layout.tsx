import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Libre_Baskerville, Lato } from 'next/font/google';
import ToasterClient from '@/components/ToasterClient';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const BASE_URL = 'https://durrani-welfare-trust.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Durrani Welfare Trust — Be-Saharon Ka Sahara | NGO Gilgit-Baltistan',
    template: '%s | Durrani Welfare Trust',
  },
  description:
    'Durrani Welfare Trust is a registered NGO in Gilgit-Baltistan, Pakistan — sheltering 50+ orphan girls, running free 24/7 ambulance services, empowering women, and serving thousands of families since 2017.',
  keywords: [
    'Durrani Welfare Trust', 'NGO Pakistan', 'NGO Gilgit-Baltistan', 'orphan girls Pakistan',
    'free ambulance Gilgit', 'women empowerment GB', 'welfare trust', 'charity Pakistan',
    'Konodas Gilgit', 'Aman Faraz Durrani', 'Waheed Faraz Durrani', 'donate Pakistan NGO',
  ],
  authors: [{ name: 'Durrani Welfare Trust', url: BASE_URL }],
  creator: 'Durrani Welfare Trust',
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Durrani Welfare Trust',
    title: 'Durrani Welfare Trust — Be-Saharon Ka Sahara',
    description:
      'Registered NGO sheltering orphan girls, running free ambulances, and empowering women in Gilgit-Baltistan since 2017.',
    images: [{ url: '/hero/banner.jpeg', width: 1200, height: 630, alt: 'Durrani Welfare Trust' }],
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Durrani Welfare Trust — NGO Gilgit-Baltistan',
    description: 'Sheltering orphan girls, free ambulance, women empowerment in Gilgit-Baltistan since 2017.',
    images: ['/hero/banner.jpeg'],
  },
  alternates: { canonical: BASE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${libreBaskerville.variable} ${lato.variable} bg-white text-gray-900 antialiased`}>
        <ToasterClient />
        {children}
      </body>
    </html>
  );
}
