const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select or add a category'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    originalPrice: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
    image: {
      type: String,
      required: [true, 'Please upload or provide an image URL'],
    },
    description: {
      type: String,
      trim: true,
    },
    tag: {
      type: String,
      enum: ['Best Seller', 'Sale', 'Featured', 'New Arrival', 'Trending', ''],
      default: 'New Arrival',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
