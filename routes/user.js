const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {  // ✅ add next parameter
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // ✅ Log the user in after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

module.exports = router;