const User = require('../models/user.js'); // ✅ FIXED

module.exports.renderSignupForm = (req, res) => {
    res.render('user/signup.ejs');
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err); // ✅ good
            req.flash("success", "Welcome to Airbnb!");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup"); // ✅ FIXED
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('user/login.ejs');
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Airbnb! You are logged in!");
    const redirectUrl = req.session.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
