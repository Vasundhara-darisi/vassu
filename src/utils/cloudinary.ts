export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'timepass');
  
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'njvxmkax';
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Cloudinary upload error:', errorData);
    throw new Error('Failed to upload file to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};
