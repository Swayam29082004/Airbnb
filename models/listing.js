const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    url: String,
    filename: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  geometry: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
  }
});

module.exports = mongoose.model('Listing', listingSchema);
