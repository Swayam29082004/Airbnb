const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Removed the parentheses to pass the function reference
    }
});

module.exports = mongoose.model("Review", reviewSchema);
