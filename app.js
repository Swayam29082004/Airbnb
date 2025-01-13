const express=require('express');
const app=express();
const mongoose = require('mongoose');
const ejs=require('ejs');
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");

main()
.then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/boilerplate'); // Set default layout in Express

app.set('layout', 'layouts/boilerplate'); // Set default layout

app.get('/',(req,res)=>{
    res.send("Hi i am root")
})

app.get("/listings",async (req,res)=>{
   const allListings = await Listing.find({});
   res.render("../listings/index", { allListings });

})

// New Router

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});


app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
        try {
        const listing = await Listing.findById(id);
        
        // Log the ID and the resulting listing
       
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving listing");
    }
});


//Create the router
app.post("/listings", async (req, res) => {
    console.log(req.body); // Log incoming form data
    const newListing = new Listing(req.body.listing);
    try {
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error creating listing: " + err.message);
    }
});


// /Edit

app.get("/listing/:id/edit",async (req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
})
// Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
});

// Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndUpdate(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


// app.get('/testListing',async (req,res)=>{
   
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "This is a beautiful villa in the center of town",
//         price:1200,
//         location:"Calangute,Goa",
//         country: "India",
//     });
//     await sampleListing.save().then(()=>{
//        console.log("Listing saved successfully");
//        res.send("sucessful testing");
//     })
// })
app.listen(8080, () => {
    console.log('Listening to the server on port 8080');
});
