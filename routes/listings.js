const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// LISTING VALIDATION
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    return next(new ExpressError(400, errMsg)); // ✅ next() not throw
  } else {
    next();
  }
};

// INDEX ROUTE
router.get("/",wrapAsync(async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index",{allListings});
}));

// NEW ROUTE
router.get("/new",(req,res)=>{
  res.render("listings/new.ejs");
});

// SHOW ROUTE
router.get("/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
const listing = await Listing.findById(id).populate("reviews");
if(!listing){
  req.flash("error","Requested listing does not exist ");
  res.redirect("/listings");

}

  res.render("listings/show",{listing});
}));

// CREATE ROUTE
router.post("/",
validateListing,
wrapAsync(async(req,res)=>{

  const newListing = new Listing(req.body.listing);

  newListing.image = {
    url: req.body.listing.image,
    filename: "listingimage"
  };

  await newListing.save();

  req.flash("success","New Listing Created!");
  res.redirect("/listings");

}));

// EDIT ROUTE
router.get("/:id",wrapAsync(async(req,res)=>{
  let {id} = req.params;

  const listing = await Listing.findById(id).populate("reviews");

  if(!listing){
    req.flash("error","Requested listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show",{listing});
}));

// UPDATE ROUTE
router.put("/:id",
  validateListing,
  wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    if(req.body.listing.image && req.body.listing.image.trim() !== ""){
      listing.image.url = req.body.listing.image;
    }

    await listing.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }) 
);   
// DELETE ROUTE
router.delete("/:id",
wrapAsync(async(req,res)=>{

  let {id}=req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success"," Listing Deleted!");

  res.redirect("/listings");

}));

module.exports = router;