import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingDocument extends Document {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISettingDocument>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model<ISettingDocument>('Setting', SettingSchema);
