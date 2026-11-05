/**
 * Client-side Cloudinary upload using unsigned upload preset
 * This bypasses the server size limits by uploading directly to Cloudinary
 */

interface UploadResult {
  url: string;
  type: string;
  size: number;
  name: string;
  public_id: string;
}

export async function uploadToCloudinary(
  file: File,
  fileType: 'image' | 'video' | 'document'
): Promise<UploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset is not configured');
  }

  // Determine Cloudinary resource type endpoint
  const resourceType = fileType === 'video' ? 'video' :
                       fileType === 'document' ? 'raw' :
                       'image';

  // Create FormData for Cloudinary upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // Upload to Cloudinary using the specific resource type endpoint
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    type: file.type,
    size: file.size,
    name: file.name,
    public_id: data.public_id,
  };
}
