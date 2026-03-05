const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = "mongodb://127.0.0.1:27017/Wanderlust";
main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.error(err);
});

async function main() {
  await mongoose.connect(MONGO_URI);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

app.post("/listings",async(req,res)=>{
  const newListings = new Listing(req.body.listing);
  await newListings.save();
  res.redirect("/listings");
});

app.get("/listings/:id/edit",async (req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", {listing});

});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
 let deletedListings=await Listing.findByIdAndDelete(id);
 console.log(deletedListings);
  res.redirect("/listings");
});


// app.get("/test-listing", async(req, res) => {
//   let sampleListing = new Listing({
//     title: "Beautiful Beach House",
//     description: "A stunning beach house.",
//     price: 250,
//     location: "Malibu",
//     country: "USA",
//   });

//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("successfull testing");
// });

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});