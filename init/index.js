const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/Listing.js');

const MONGO_URI = "mongodb://127.0.0.1:27017/Wanderlust";
main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.error(err);
});

async function main() {
  await mongoose.connect(MONGO_URI);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Database was initialized ");
}

initDB();


