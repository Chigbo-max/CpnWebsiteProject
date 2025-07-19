const cloudinary = require('cloudinary').v2;
require('dotenv').config();
// const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generates a fallback image (dark background with 'Event' text) and returns a local file path.
 * @returns {string} The local file path of the generated image.
 */
function generateFallbackImage() {
  // Temporarily disabled canvas functionality
  // const width = 600;
  // const height = 400;
  // const canvas = createCanvas(width, height);
  // const ctx = canvas.getContext('2d');

  // // Draw dark background
  // ctx.fillStyle = '#18181b';
  // ctx.fillRect(0, 0, width, height);

  // // Draw 'Event' text
  // ctx.font = 'bold 64px Arial';
  // ctx.fillStyle = '#fff';
  // ctx.textAlign = 'center';
  // ctx.textBaseline = 'middle';
  // ctx.fillText('Event', width / 2, height / 2);

  // // Save to a temp file
  // const fileName = `event-fallback-${Date.now()}.png`;
  // const filePath = path.join(__dirname, '../uploads', fileName);
  // const buffer = canvas.toBuffer('image/png');
  // fs.writeFileSync(filePath, buffer);
  // return filePath;
  
  // Return a placeholder URL for now
  return '/uploads/placeholder-event.png';
}

/**
 * Uploads an image to Cloudinary. If upload fails, generates a fallback image and returns its local URL.
 * @param {string} filePath - The base64 image string (data URL).
 * @returns {Promise<string>} The Cloudinary image URL or fallback image URL.
 */
const uploadImage = async (filePath, folder = 'uploads') => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    }).then(result => result.secure_url);
  } catch (err) {
    // Generate fallback image
    const fallbackPath = generateFallbackImage();
    // Return a local URL (assuming /uploads is served statically)
    const fallbackUrl = `/uploads/${path.basename(fallbackPath)}`;
    // Optionally, log or notify the user
    console.error('Cloudinary upload failed, using fallback image:', err.message);
    // You can throw a custom error or return the fallback URL
    return fallbackUrl;
  }
};

module.exports = {
  uploadImage,
}; 