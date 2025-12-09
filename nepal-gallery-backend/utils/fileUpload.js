const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');

// 1. Configure S3 Client (Works for AWS or Backblaze)
const s3 = new S3Client({
  region: process.env.B2_REGION, 
  endpoint: process.env.B2_ENDPOINT, 
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY
  }
});

// 2. Define Storage Engine
const storage = process.env.NODE_ENV === 'production' 
  ? multerS3({
      s3: s3,
      bucket: process.env.B2_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `uploads/${Date.now().toString()}-${file.originalname}`);
      }
    })
  : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Local folder
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    });

// 3. Filter (Images Only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB Limit
});

module.exports = upload;