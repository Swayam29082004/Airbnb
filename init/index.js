    const mongoose = require('mongoose');
    const initData = require("./data.js");
    const Listing = require("../models/listing.js");

    main()
        .then(() => {
            console.log("Connected to DB");
        })
        .catch(err => console.log(err));

        async function main() {
            await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        
    const initDB = async () => {
        await Listing.deleteMany({}); // Fixed typo from `detelMany` to `deleteMany`
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
        console.log(initData.data);
    }

    initDB();
