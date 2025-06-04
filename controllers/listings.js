const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
};

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render('listings/new');
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        });

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect('/listings');
    }
    
    res.render('listings/show.ejs',{listing});
};

module.exports.createListing = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // 👀 See what’s actually being submitted

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
       

        req.flash("success", "New Listing Created!");
        res.redirect('/listings');
    } catch (err) {
        console.error("Error Creating Listing:", err);
        req.flash("error", "There was a problem creating the listing.");
        res.redirect('/listings/new');
    }
    //  console.log(req.body.listing)
};
module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit", { listing }); // ✅ Ensure 'listing' is passed
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect('/listings');
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect('/listings');
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect('/listings');
};
