const dotenv = require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStrategy({
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        callbackURL: "http://localhost/google/callback"

    },
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});