const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // from your .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // from your .env file
      callbackURL: "https://whiteboard-backend-sfp3.onrender.com/auth/google/callback", // URL to handle callback
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract data from profile
        const { id, displayName, emails, photos } = profile;

        // Find an existing user or create a new one
        let user = await User.findOne({ googleId: id });
        if (!user) {
          user = await User.create({
            googleId: id,
            name: displayName,
            email: emails[0].value,
            profilePic: photos[0].value,
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize user for session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
