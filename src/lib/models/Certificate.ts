import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateDocument extends Document {
  title: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificateDocument>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Certificate = mongoose.models.Certificate || mongoose.model<ICertificateDocument>('Certificate', CertificateSchema);
