const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  // 1. Basic Info
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },

  // 2. Content Type Strategy
  // 'embed' = YouTube/Pornhub iframe
  // 'hosted' = Images stored in S3/Backblaze
  contentType: {
    type: String,
    enum: ['embed', 'hosted'], 
    default: 'embed'
  },

  // 3. For 'Embed' Type (Phase 1)
  embedCode: {
    type: String,
    // Only required if contentType is 'embed'
  },

  // 4. For 'Hosted' Type (Phase 2 - S3 URLs)
  thumbnail: {
    type: String, // URL of the cover image
    default: 'no-photo.jpg'
  },
  images: [
    {
      url: String,
      altText: String
    }
  ],

  // 5. Organization (Vital for Views/Ads)
  tags: [String], // e.g. ['blonde', 'outdoor', 'milf']
  views: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);