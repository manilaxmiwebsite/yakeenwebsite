import { connectDB } from './db';
import { Setting } from './models/Setting';
import { IInstagramImage } from '@/types';

export interface SiteSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  aboutTitle: string;
  aboutContent: string;
  aboutImage: string;
  footerBrandStatement: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  instagramUrl: string;
  instagramToken: string;
  instagramImages: IInstagramImage[];
  logo: string;
  brandName: string;
  headerLogo: string;
  sections: {
    hero: boolean;
    explore: boolean;
    about: boolean;
    certificates: boolean;
    instagram: boolean;
  };
}

const defaultSettings: SiteSettings = {
  whatsappNumber: '919876543210',
  whatsappMessage: 'Hello Manilakshmi Silver, I am interested in this product: {product}. Please share more details.',
  aboutTitle: 'Our Legacy',
  aboutContent: 'For generations, Manilakshmi Silver has been synonymous with unparalleled craftsmanship and timeless elegance. Each piece is meticulously handcrafted by master artisans who transform pure silver into wearable art. Our commitment to quality, purity, and design excellence has made us a trusted name in premium silver jewelry.',
  aboutImage: '/placeholder-about.jpg',
  footerBrandStatement: 'Crafting timeless silver masterpieces since generations. Purity, elegance, and heritage in every piece.',
  footerEmail: 'hello@manilakshmi.com',
  footerPhone: '+91 9876543210',
  footerAddress: 'Mumbai, Maharashtra, India',
  instagramUrl: 'https://instagram.com/manilakshmisilver',
  instagramToken: '',
  instagramImages: [],
  logo: '',
  brandName: 'Manilakshmi Silver',
  headerLogo: '',
  sections: {
    hero: true,
    explore: true,
    about: true,
    certificates: true,
    instagram: true,
  },
};

export const SETTING_KEYS = {
  WHATSAPP_NUMBER: 'whatsappNumber',
  WHATSAPP_MESSAGE: 'whatsappMessage',
  ABOUT_TITLE: 'aboutTitle',
  ABOUT_CONTENT: 'aboutContent',
  ABOUT_IMAGE: 'aboutImage',
  FOOTER_STATEMENT: 'footerBrandStatement',
  FOOTER_EMAIL: 'footerEmail',
  FOOTER_PHONE: 'footerPhone',
  FOOTER_ADDRESS: 'footerAddress',
  INSTAGRAM_URL: 'instagramUrl',
  INSTAGRAM_TOKEN: 'instagramToken',
  INSTAGRAM_IMAGES: 'instagramImages',
  LOGO: 'logo',
  BRAND_NAME: 'brandName',
  HEADER_LOGO: 'headerLogo',
  SECTION_HERO: 'section_hero',
  SECTION_EXPLORE: 'section_explore',
  SECTION_ABOUT: 'section_about',
  SECTION_CERTIFICATES: 'section_certificates',
  SECTION_INSTAGRAM: 'section_instagram',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await connectDB();
    const settings = await Setting.find({});
    const settingMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingMap[s.key] = s.value;
    });

    return {
      whatsappNumber: settingMap[SETTING_KEYS.WHATSAPP_NUMBER] || defaultSettings.whatsappNumber,
      whatsappMessage: settingMap[SETTING_KEYS.WHATSAPP_MESSAGE] || defaultSettings.whatsappMessage,
      aboutTitle: settingMap[SETTING_KEYS.ABOUT_TITLE] || defaultSettings.aboutTitle,
      aboutContent: settingMap[SETTING_KEYS.ABOUT_CONTENT] || defaultSettings.aboutContent,
      aboutImage: settingMap[SETTING_KEYS.ABOUT_IMAGE] || defaultSettings.aboutImage,
      footerBrandStatement: settingMap[SETTING_KEYS.FOOTER_STATEMENT] || defaultSettings.footerBrandStatement,
      footerEmail: settingMap[SETTING_KEYS.FOOTER_EMAIL] || defaultSettings.footerEmail,
      footerPhone: settingMap[SETTING_KEYS.FOOTER_PHONE] || defaultSettings.footerPhone,
      footerAddress: settingMap[SETTING_KEYS.FOOTER_ADDRESS] || defaultSettings.footerAddress,
      instagramUrl: settingMap[SETTING_KEYS.INSTAGRAM_URL] || defaultSettings.instagramUrl,
      instagramToken: settingMap[SETTING_KEYS.INSTAGRAM_TOKEN] || '',
      instagramImages: (() => {
        const raw = settingMap[SETTING_KEYS.INSTAGRAM_IMAGES];
        if (raw) {
          try { return JSON.parse(raw) as IInstagramImage[]; } catch { return []; }
        }
        return [];
      })(),
      logo: settingMap[SETTING_KEYS.LOGO] || '',
      brandName: settingMap[SETTING_KEYS.BRAND_NAME] || defaultSettings.brandName,
      headerLogo: settingMap[SETTING_KEYS.HEADER_LOGO] || '',
      sections: {
        hero: settingMap[SETTING_KEYS.SECTION_HERO] !== 'false',
        explore: settingMap[SETTING_KEYS.SECTION_EXPLORE] !== 'false',
        about: settingMap[SETTING_KEYS.SECTION_ABOUT] !== 'false',
        certificates: settingMap[SETTING_KEYS.SECTION_CERTIFICATES] !== 'false',
        instagram: settingMap[SETTING_KEYS.SECTION_INSTAGRAM] !== 'false',
      },
    };
  } catch {
    return defaultSettings;
  }
}

export async function updateSetting(key: string, value: string) {
  await connectDB();
  await Setting.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
}

export async function updateSettings(settings: Record<string, string>) {
  await connectDB();
  const ops = Object.entries(settings).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { $set: { value } },
      upsert: true,
    },
  }));
  await Setting.bulkWrite(ops);
}
