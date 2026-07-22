import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Manilakshmi Silver | Premium Silver Jewelry',
  description:
    'Discover timeless elegance at Manilakshmi Silver. Handcrafted premium silver jewelry, pure craftsmanship since generations. Explore our curated collection of chains, bracelets, rings, and more.',
  keywords: ['silver jewelry', 'premium silver', 'handcrafted silver', 'Manilakshmi', 'Indian silver jewelry'],
  openGraph: {
    title: 'Manilakshmi Silver | Premium Silver Jewelry',
    description: 'Timeless silver masterpieces crafted with tradition and purity.',
    siteName: 'Manilakshmi Silver',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
