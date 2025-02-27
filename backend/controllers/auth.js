const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth Routes
router.get("/google", (req, res, next) => {
    const redirectUrl = req.query.redirect || "/dashboard";
    console.log("inside google api", redirectUrl);
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirectUrl
    })(req, res, next);
});

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (req, res) => {
        // Retrieve the redirect URL from the state parameter.
        // const redirectTo = req.query.state || "/dashboard";

        const redirectTo = req.query.state ? decodeURIComponent(req.query.state) : "/dashboard";
        console.log("inside callback", redirectTo);
        res.redirect(redirectTo);

        // res.redirect(`${redirectTo}`);
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
    const redirect = req.query.redirect ? `?redirect=${encodeURIComponent(req.query.redirect)}` : "";
    res.send(`Please login via <a href="/auth/google${redirect}">Google</a>`);
});

// Logout Route (Fixed)
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
