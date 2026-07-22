import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  details: string[];
  images: string[];
  caption: string;
  category: mongoose.Types.ObjectId;
  isActive: boolean;
  isHero: boolean;
  heroOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    details: [{ type: String }],
    images: [{ type: String }],
    caption: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isActive: { type: Boolean, default: true },
    isHero: { type: Boolean, default: false },
    heroOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isHero: 1, heroOrder: 1 });

export const Product = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
