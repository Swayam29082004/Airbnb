const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string()
      .valid(
        'Apartments', 'Trending', 'Rooms', 'Beach', 'Mountain',
        'City', 'Pet Friendly', 'Pool', 'Castles', 'Resorts'
      )
      .required(),
    image: Joi.object({
      filename: Joi.string().allow("", null),
      url: Joi.string().allow("", null)
    }).optional()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});
