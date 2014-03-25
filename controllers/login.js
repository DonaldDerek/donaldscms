'use strict';

var LoginModel = require('../models/login'),
    passport = require('passport'),
    auth = require('../lib/auth');


module.exports = function (app) {

    var model = new LoginModel();


    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    app.get('/login', function (req, res) {

        //Include any error messages that come from the login process.
        model.messages = req.flash('error');
        res.render('login', model);
    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    app.post('/login', function (req, res) {
        passport.authenticate('local', {
            successRedirect: req.session.goingTo || '/rootaccess',
            failureRedirect: "/login",
            failureFlash: true
        })(req, res);

    });

    app.get('/rootaccess', auth.isAuthenticated('admin'), function (req, res) {

        res.render('root', model);

    });
    /**
     * Allow the users to log out
     */
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};