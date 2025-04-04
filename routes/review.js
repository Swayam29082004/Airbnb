const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const {reviewSchema } = require("../schema.js");
const Review=require("../models/review.js")

const validateReview =(req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errorMsg);
    } else {
        next();
    }
  }
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id); 
    let newReview=new Review(req.body.review);
    newReview.listing = listing; 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }));
  
  
  // Delete  review Route
  router.delete("/", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
  })
  );
module.exports=router;