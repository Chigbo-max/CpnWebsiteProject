// ICloudinaryService interface
class ICloudinaryService {
  uploadImage(filePath, folder) { throw new Error('Not implemented'); }
}

// CloudinaryServiceImpl implements ICloudinaryService
class CloudinaryServiceImpl extends ICloudinaryService {
  constructor() {
    super();
  }

  async uploadImage(filePath, folder = 'uploads') {
    const cloudinary = require('cloudinary').v2;
    require('dotenv').config();
    const fs = require('fs');
    const path = require('path');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    function generateFallbackImage() {
      return '/uploads/placeholder-event.png';
    }
    try {
      return await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
      }).then(result => result.secure_url);
    } catch (err) {
      const fallbackPath = generateFallbackImage();
      const fallbackUrl = `/uploads/${path.basename(fallbackPath)}`;
      console.error('Cloudinary upload failed, using fallback image:', err.message);
      return fallbackUrl;
    }
  }
}

module.exports = { ICloudinaryService, CloudinaryServiceImpl }; 