import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image: string): Promise<string> {
  const result = await cloudinary.uploader.upload(image, {
    folder: 'manilakshmi-silver',
    quality: 'auto',
    fetch_format: 'auto',
  });
  return result.secure_url;
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/');
  const fileWithExtension = parts[parts.length - 1];
  const publicId = `manilakshmi-silver/${fileWithExtension.split('.')[0]}`;
  return publicId;
}

export { cloudinary };
