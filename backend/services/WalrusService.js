const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const walrus = new AWS.S3({
  endpoint: process.env.WALRUS_ENDPOINT, // e.g. 'https://nyc3.walrus.walrus.com'
  accessKeyId: process.env.WALRUS_ACCESS_KEY,
  secretAccessKey: process.env.WALRUS_SECRET_KEY,
  region: process.env.WALRUS_REGION || 'us-east-1',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const WALRUS_BUCKET = process.env.WALRUS_BUCKET;

/**
 * Uploads a base64 image to Walrus and returns the public URL.
 * @param {string} base64Image - The base64-encoded image string (data URL).
 * @param {string} [folder] - Optional folder in the bucket.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
async function uploadImage(base64Image, folder = 'uploads') {
  // Parse base64 data
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64 image');
  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const ext = contentType.split('/')[1] || 'jpg';
  const key = `${folder}/${uuidv4()}.${ext}`;

  await walrus.putObject({
    Bucket: WALRUS_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  }).promise();

  // Construct public URL
  const url = `${process.env.WALRUS_PUBLIC_URL || process.env.WALRUS_ENDPOINT}/${WALRUS_BUCKET}/${key}`;
  return url;
}

module.exports = {
  uploadImage,
}; 