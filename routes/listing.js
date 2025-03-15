const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const { listingSchema, reviewSchema } = require("../schema.js");


// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); // assuming you have a `listingSchema` for validation
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// Get all listings
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
}));

// Create New Listing Form
router.get('/new', (req, res) => {
  res.render('listings/new');
});

// View Single Listing
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.render('listings/show', { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving listing');
  }
});

// Create New Listing
router.post('/', validateListing, async (req, res) => {
  const newListing = new Listing(req.body.listing);
  try {
    await newListing.save();
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error creating listing: ' + err.message);
  }
});

// Edit Listing Form
router.get('/:id/edit', async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit', { listing });
});

// Update Listing
router.put('/:id', validateListing, async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error updating listing: ' + err.message);
  }
});

// Delete Listing
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting listing');
  }
});

module.exports = router;
