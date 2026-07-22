import { ReactNode } from 'react';
import { getSiteSettings } from '@/lib/site-data';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import FloatingWhatsApp from '@/components/site/FloatingWhatsApp';

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
      <FloatingWhatsApp
        phoneNumber={settings.whatsappNumber}
        brandName={settings.brandName}
        message={(settings.whatsappMessage || 'Hello Manilakshmi Silver, I would like to know more about your premium silver collection.').replace('{product}', 'your premium silver collection')}
      />
    </>
  );
}
