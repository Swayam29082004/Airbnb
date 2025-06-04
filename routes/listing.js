const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require('../controllers/listings.js');


// Get all listings
router.get('/', wrapAsync(listingController.index));

// Create New Listing Form
router.get('/new', isLoggedIn, listingController.renderNewForm);

// View Single Listing
router.get('/:id', wrapAsync(listingController.showListing));


// Create New Listing
router.post('/', isLoggedIn ,validateListing, wrapAsync(listingController.createListing));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEdit));

// Update Listing
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Listing
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
