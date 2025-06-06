const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

// GET - Signup Page
router.get('/signup', (req, res) => {
    res.render('user/signup.ejs');
});

// POST - Signup User
router.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Auto-login after registration
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Airbnb!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

// GET - Login Page
router.get('/login', (req, res) => {
    res.render('user/login.ejs');
});

// POST - Login
router.post('/login',
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome to Airbnb! You are logged in!");
        const redirectUrl = req.session.redirectUrl || '/listings';
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);
    }
);

// GET - Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;
