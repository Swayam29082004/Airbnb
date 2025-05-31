const express = require('express'); 
const router = express.Router(); 
const User = require('../models/user.js'); 
const passport = require('passport'); 
const { saveRedirectUrl } = require('../middleware.js');  

router.get('/signup', (req, res) => { 
    res.render('user/signup.ejs'); 
});

router.post('/signup', async (req, res, next) => { 
    try { 
        let { username, email, password } = req.body; 
        const newuser = new User({ email, username }); 
        const registeredUser = await User.register(newuser, password); 
        console.log(registeredUser); 
        
        req.login(registeredUser, (err) => { 
            if (err) { 
                return next(err); 
            } 
            req.flash("success", "Welcome to Airbnb"); 
            res.redirect("/listings"); 
        }); 
    } catch (e) { 
        req.flash("error", e.message); 
        res.redirect("/signup"); 
    }  
});

router.get("/login", (req, res) => { 
    res.render('user/login.ejs'); 
});

router.post("/login", 
    saveRedirectUrl, 
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true, 
    }), 
    async (req, res) => { 
        req.flash("success", "Welcome to Airbnb! You are logged in!"); 
        let redirectUrl = req.session.redirectUrl || '/listings';  

        delete req.session.redirectUrl;  

        res.redirect(redirectUrl); 
    }
); 

router.get('/logout', (req, res, next) => { 
    req.logout((err) => { 
        if (err) { 
            return next(err); 
        } 
        req.flash("success", "You are logged out!"); 
        res.redirect("/listings"); 
    }); 
}); 

module.exports = router;
