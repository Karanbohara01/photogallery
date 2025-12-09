import mongoose, { Schema, models, model } from 'mongoose';

export interface IGalleryImage {
  url: string;
  altText: string;
}

export interface IGallery extends mongoose.Document {
  title: string;
  description?: string;
  contentType: 'embed' | 'hosted';
  embedCode?: string;
  thumbnail?: string;
  images: IGalleryImage[];
  tags: string[];
  views: number;
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>({
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
  contentType: {
    type: String,
    enum: ['embed', 'hosted'],
    default: 'embed'
  },
  embedCode: {
    type: String
  },
  thumbnail: {
    type: String,
    default: 'no-photo.jpg'
  },
  images: [
    {
      url: String,
      altText: String
    }
  ],
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Gallery = models.Gallery || model<IGallery>('Gallery', GallerySchema);


