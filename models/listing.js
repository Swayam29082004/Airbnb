const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: "Untitled Listing",
    },
       
    description: {
        type: String,
    },
    
    image: {
        url: {
            type: String,
            default: "https://media.istockphoto.com/id/1191376167/photo/island-villa.jpg?s=1024x1024&w=is&k=20&c=2iLa3jhrdiamX0lA9KdxYhCxGFJ65wLXCd-B48Eec4E=", // Default image URL
            set: (v) => (v === "" ? "https://media.istockphoto.com/id/1191376167/photo/island-villa.jpg?s=1024x1024&w=is&k=20&c=2iLa3jhrdiamX0lA9KdxYhCxGFJ65wLXCd-B48Eec4E=" : v),
        },
        filename: {
            type: String,
            default: "", // Default filename
        },
    },
    
    price: {
        type: Number,
        default: 0, // Default price is 0
    },
    
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    },
    ]
    
});
const Listing=mongoose.model('Listing',listingSchema)
module.exports = Listing;