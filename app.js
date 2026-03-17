const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ROUTERS
const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// DATABASE CONNECTION
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(()=> console.log("Connected to DB"))
.catch((err)=> console.log(err));

async function main(){
  await mongoose.connect(MONGO_URL);
}

// VIEW ENGINE
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

// MIDDLEWARE
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH MESSAGES
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ROUTES
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// HOME ROUTE
app.get("/",(req,res)=>{
  res.send("Project started");
});

// INVALID ROUTE
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

// ERROR HANDLER
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"} = err;
  console.log(err.stack);
  res.status(statusCode).render("error.ejs",{err});
});

// SERVER
app.listen(8000,()=>{
  console.log("Server running on port 8000");
});
