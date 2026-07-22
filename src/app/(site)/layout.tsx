import { ReactNode } from 'react';
import { getSiteSettings } from '@/lib/site-data';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header
        whatsappNumber={settings.whatsappNumber}
        brandName={settings.brandName}
        logo={settings.logo}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        brandName={settings.brandName}
        brandStatement={settings.footerBrandStatement}
        email={settings.footerEmail}
        phone={settings.footerPhone}
        address={settings.footerAddress}
        instagramUrl={settings.instagramUrl}
        whatsappNumber={settings.whatsappNumber}
        logo={settings.logo}
      />
    </>
  );
}
