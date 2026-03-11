const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

// ROUTERS
const listingsRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");


// DATABASE CONNECTION
const MONGO_URI = "mongodb://127.0.0.1:27017/Wanderlust";

async function main(){
  await mongoose.connect(MONGO_URI);
}

main()
.then(()=> console.log("Connected to DB"))
.catch(err=> console.log(err));


// VIEW ENGINE
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);


// MIDDLEWARE
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));


// HOME ROUTE
app.get("/",(req,res)=>{
  res.send("Project started");
});


// ROUTES
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);


// INVALID ROUTE
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});


// ERROR HANDLER
app.use((err,req,res,next)=>{
  let {statusCode=500} = err;

  if(!err.message){
    err.message = "Something went wrong!";
  }

  res.status(statusCode).render("error.ejs",{err});
});


// SERVER START
app.listen(8000,()=>{
  console.log("Server running on port 8000");
});