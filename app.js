const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require('./models/listing.js');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require('./models/review');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { err });
});

// Start Server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
