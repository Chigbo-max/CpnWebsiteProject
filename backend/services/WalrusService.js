// IWalrusService interface
class IWalrusService {
  uploadImage(base64Image, folder) { throw new Error('Not implemented'); }
}

// WalrusServiceImpl implements IWalrusService
class WalrusServiceImpl extends IWalrusService {
  constructor() {
    super();
    this.AWS = require('aws-sdk');
    this.uuidv4 = require('uuid').v4;
    this.walrus = new this.AWS.S3({
      endpoint: process.env.WALRUS_ENDPOINT,
      accessKeyId: process.env.WALRUS_ACCESS_KEY,
      secretAccessKey: process.env.WALRUS_SECRET_KEY,
      region: process.env.WALRUS_REGION || 'us-east-1',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    this.WALRUS_BUCKET = process.env.WALRUS_BUCKET;
  }

  async uploadImage(base64Image, folder = 'uploads') {
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 image');
    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = contentType.split('/')[1] || 'jpg';
    const key = `${folder}/${this.uuidv4()}.${ext}`;
    await this.walrus.putObject({
      Bucket: this.WALRUS_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    }).promise();
    const url = `${process.env.WALRUS_PUBLIC_URL || process.env.WALRUS_ENDPOINT}/${this.WALRUS_BUCKET}/${key}`;
    return url;
  }
}

module.exports = { IWalrusService, WalrusServiceImpl }; 