const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userControllers = require('../controllers/users.js');
const wrapAsync = require('../utils/wrapAsync.js');

// Signup Routes
router.route('/signup')
    .get(wrapAsync(userControllers.renderSignupForm))
    .post(userControllers.signup);

// Login Routes
router.route('/login')
    .get(userControllers.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        userControllers.login
    );

// Logout Route
router.get('/logout', userControllers.logout);

module.exports = router;
