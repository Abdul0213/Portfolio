import type { Metadata, Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const title = 'Abdul Rehman — Graphic Designer | Branding, Social Media & Ad Creatives';
const description =
  'Production-ready, high-impact editorial portfolio for graphic designer Abdul Rehman. Specializing in branding, social media, ad creatives, UI/UX and 3D packaging mockups.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark scroll-smooth ${syne.variable} ${dmSans.variable}`}>
      <body className="bg-[#0E0E0E] text-[#F5F5F5] antialiased selection:bg-[#7B5CFF] selection:text-white overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
