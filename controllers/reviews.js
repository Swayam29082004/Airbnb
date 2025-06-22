const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log(req.newReview);
        req.flash('success', 'New review created');
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.destroyReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Review deleted successfully');
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};
