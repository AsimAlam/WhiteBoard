const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (req, res) => {
        res.redirect("http://localhost:3000/dashboard");
    }
);

// Protected Route
router.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ data: req.user });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});


// Login Route
router.get("/login", (req, res) => {
    res.send("Please login via <a href='/auth/google'>Google</a>");
});

// Logout Route (Fixed)
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
