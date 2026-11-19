import { authenticatedApiRequest } from '@/lib/api';

export async function uploadImage(file: File): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || !file.size || file.size > 5 * 1024 * 1024) throw new Error('Choose a PNG, JPEG, or WebP image up to 5 MB.');
  try {
    const bitmap = await createImageBitmap(file);
    const valid = bitmap.width > 0 && bitmap.height > 0 && bitmap.width * bitmap.height <= 25000000;
    bitmap.close();
    if (!valid) throw new Error('Image dimensions are too large.');
  } catch { throw new Error('This image could not be read. Use a valid image up to 25 megapixels.'); }
  const image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') return reject(new Error('Could not read the selected image.'));
      resolve(reader.result.slice(reader.result.indexOf(',') + 1));
    };
    reader.readAsDataURL(file);
  });
  const result = await authenticatedApiRequest<{ url: string }>('/api/uploads', { method: 'POST', body: JSON.stringify({ image }) });
  const url = new URL(result.url);
  if (url.protocol !== 'https:' || url.hostname !== 'i.ibb.co' || url.username || url.password || url.port) throw new Error('Image upload returned an invalid URL.');
  return url.href;
}
