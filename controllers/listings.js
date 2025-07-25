const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const allListings = await Listing.find(filter);
    res.render('listings/index', { allListings, selectedCategory: category || '' });
};
module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render('listings/new');
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
 const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing});
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send()
        

    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; 
    newListing.image={url,filename};

    newListing.geometry = response.body.features[0].geometry; 

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};


module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let originalImageUrl =listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit", { listing ,originalImageUrl}); // ✅ Ensure 'listing' is passed
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !="undefined"){
        let url=req.file.path;
        let filename=req.file.path;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destoryListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect('/listings');
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect('/listings');
};
