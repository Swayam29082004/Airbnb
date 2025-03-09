const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require('./models/listing');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require('./models/review');
const app = express();

// Connect to MongoDB
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
  console.log('Connected to DB');
}
main().catch(err => console.error('DB Connection Error:', err));

// Middleware Setup
app.engine('ejs', ejsMate); // Enable ejs-mate
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('layout', 'layouts/boilerplate'); // Set default layout
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Wonderlust!');
});
const validateListing =(req,res,next) => {
  let result=listingSchema.validate(req.body);
    if(error){
    let erMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, erMsg);
  }else{
    next();
  }
}
const validateReview =(req,res,next) => {
  let result=reviewSchema.validate(req.body);
    if(error){
    let erMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, erMsg);
  }else{
    next();
  }
}

// Get All Listings
app.get('/listings',  wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
}));

// Create New Listing Form
app.get('/listings/new', (req, res) => {
  res.render('listings/new');
});

app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id); 
  let newReview=new Review(req.body.review);
  newReview.listing = listing; 
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// View Single Listing
app.get('/listings/:id',  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render('listings/show', { listing });
}));

// Create New Listing

app.post('/listings',validateListing,
   wrapAsync(async (req, res, next) => {
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
}));


// Edit Listing Form
app.get("/listings/:id/edit",  wrapAsync(async (req, res) => {
    const { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit", { listing });
}));


// Update Listing
app.put("/listings/:id",  validateListing,
  wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect("/listings");
}));


// Delete Listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

app.all("*",(req, res,next) => {
  next(new ExpressError(404,"Page not Found!"));
})  
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err; 
  res.status(statusCode).render("listings/error", {err });


});
// Review
// Post




// Start Server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});