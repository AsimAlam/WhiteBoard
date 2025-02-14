
const session = require("express-session");
const passport = require("../passport/passport-setup");
const cors = require('cors');

const authRoutes = require('../controllers/auth');

module.exports = (app) => {
    // Express session middleware
    app.use(
        session({
            secret: "your_session_secret", // change this to a strong secret
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Load authentication routes
    app.use("/auth", authRoutes);
};
