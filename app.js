const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require('./models/listing');

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

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Wonderlust!');
});

// Get All Listings
app.get('/listings', async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
});

// Create New Listing Form
app.get('/listings/new', (req, res) => {
  res.render('listings/new');
});

// View Single Listing
app.get('/listings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
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
app.post('/listings', async (req, res) => {
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
app.get('/listings/:id/edit', async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit', { listing });
});

// Update Listing
app.put('/listings/:id', async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect('/listings');
});

// Delete Listing
app.delete('/listings/:id', async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
});

// Start Server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');

