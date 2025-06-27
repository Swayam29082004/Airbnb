const Listing = require('./models/listing');
const ExpressError = require("./utils/ExpressError");
const { listingSchema ,reviewSchema} = require("./schema.js");
const Review = require("./models/review"); // Ensure the correct path
const { wrapAsync } = require("./utils/wrapAsync");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl; // Store the intended URL before redirecting
      req.flash("error", "You must be logged in to create listings");
      return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) { // Ensure the correct key is used
      res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params;
  let listing=await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error","You don't have permisson to edit");
     return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.validateListing = (req, res, next) => {
  if (!req.body.listing) {
    return next(new ExpressError(400, "Invalid listing data."));
  }

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};
module.exports.validateReview =(req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errorMsg);
    } else {
        next();
    }
  }
  module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


