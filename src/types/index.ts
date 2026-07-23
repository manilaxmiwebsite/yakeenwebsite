export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  details: string[];
  images: string[];
  caption: string;
  category: string | ICategory;
  isActive: boolean;
  isHero: boolean;
  heroOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  parentId: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICertificate {
  _id: string;
  title: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISetting {
  _id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInstagramImage {
  image: string;
  caption: string;
}

export interface ISiteSettings {
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
  instagramImages: IInstagramImage[];
  exploreCategoryIds: string;
  logo: string;
  brandName: string;
  sections: {
    hero: boolean;
    explore: boolean;
    about: boolean;
    certificates: boolean;
    instagram: boolean;
  };
}

export interface IAdmin {
  _id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface IHeroProduct {
  _id: string;
  name: string;
  caption: string;
  image: string;
  isActive: boolean;
  order: number;
}
