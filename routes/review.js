const express = require("express");
const router = express.Router({ mergeParams: true }); // 
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewControllers=require("../controllers/reviews.js")
// Create Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));

// Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewControllers.destoryReview));

module.exports = router; // ✅ Ensure you export router
