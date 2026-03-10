// Cloudinary unsigned upload helper
// Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads an image file to Cloudinary using unsigned upload.
 * @param {File} file - The image file to upload
 * @param {{ make?: string, model?: string, year?: string }} [tractorInfo] - Tractor details for folder structure
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (file, tractorInfo = {}) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env');
    }

    // Build folder: ramkabir-auto/inventory/Make_Model_Year
    const sanitize = (str) => (str || '').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const subfolder = [tractorInfo.make, tractorInfo.model, tractorInfo.year]
        .filter(Boolean)
        .map(sanitize)
        .join('_');
    const folder = subfolder
        ? `ramkabir-auto/inventory/${subfolder}`
        : 'ramkabir-auto/inventory';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
    );

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Image upload failed');
    }

    const data = await response.json();
    return data.secure_url;
};
