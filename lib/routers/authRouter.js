const express = require('express');

const Authenticator = require('../security/Authenticator');
const isValidEmail = require('../util/isValidEmail');

const User = require('../models/User');

const router = express.Router();

router.get('/auth/login', (req, res) =>
{
    let errorMessage = '';
    let form = {email: ''};
    if (req.session.loginError)
    {
        // Cycle the error message
        errorMessage = req.session.loginError;
        delete req.session.loginError;
    }

    if (req.session.loginForm)
    {
        form = req.session.loginForm;
        delete req.session.loginForm;
    }

    res.render('pages/login', {errorMessage, form});
});

router.get('/auth/login/success', (req, res) =>
{
    const pageData = {
        successMessage: 'Congratulations!  You\'re logged in!',
        linkHref: '/',
        linkText: 'Go to the admin page',
    };

    res.render('pages/success', pageData);
});

router.post('/auth/login', (req, res) =>
{
    const {
        email,
        password,
    } = req.body;

    Authenticator.authenticate({email, password}, (err, user) =>
    {
        if (err != null)
        {
            // Something didn't work right

            // TODO: Respond with 500 for XHR / json requests instead of a redirect
            req.session.loginError = 'An error occurred while trying to authenticate you. Please wait a few minutes and try logging in again.';

            // Under no circumstances should include the password here!
            req.session.loginForm = {email};

            res.redirect(303, '/auth/login');
            return;
        }

        if (user == null)
        {
            // Login failed

            // TODO: Respond with 401 for XHR / json requests instead of a redirect
            req.session.loginError = 'Login failed.  Please check your email address and password and try again.';

            // Under no circumstances should include the password here!
            req.session.loginForm = {email};

            res.redirect(303, '/auth/login');
            return;
        }

        // Login worked!
        // Redirect to login success page
        res.redirect(303, '/auth/login/success');
    });
});

router.get('/auth/register', (req, res) =>
{
    let errorMessage = '';
    let form = {email: ''};
    if (req.session.registrationError)
    {
        // Cycle the error message
        errorMessage = req.session.registrationError;
        delete req.session.registrationError;
    }
    if (req.session.registrationForm)
    {
        form = req.session.registrationForm;
        delete req.session.registrationForm;
    }
    res.render('pages/register', {errorMessage, form});
});

router.get('/auth/register/success', (req, res) =>
{
    const pageData = {
        successMessage: 'Congratulations!  You\'re registered!',
        linkHref: '/auth/login',
        linkText: 'Now go login',
    };

    res.render('pages/success', pageData);
});

router.post('/auth/register', (req, res) =>
{
    const {
        email,
        password,
        passwordAgain,
    } = req.body;

    // Under no circumstances should you put the password or repeated password here!
    const registrationForm = {email};

    if (!isValidEmail(email))
    {
        req.session.registrationError = 'You must provided a valid email.';
        req.session.registrationForm = registrationForm;
        res.redirect(303, '/auth/register');
        return;
    }

    if (password !== passwordAgain)
    {
        req.session.registrationError = 'The passwords do not match.';
        req.session.registrationForm = registrationForm;
        res.redirect(303, '/auth/register');
        return;
    }

    Authenticator.validatePassword(password, (err) =>
    {
        if (err != null)
        {
            req.session.registrationError = err.message;
            req.session.registrationForm = registrationForm;
            res.redirect(303, '/auth/register');
            return;
        }

        // password is acceptable

        Authenticator.encryptPassword(password, (err, hashedPassword) =>
        {
            if (err != null)
            {
                // TODO: log the error for review
                req.session.registrationError = 'Unable to create the account.  Please try again in a few minutes, or reset your password if you are already registered.';
                req.session.registrationForm = registrationForm;
                res.redirect(303, '/auth/register');
                return;
            }

            const user = User({email, hashedPassword});
            User.insertOne(user, (err) =>
            {
                if (err != null)
                {
                    // TODO: log the error for review
                    // This could be a unique key contraint failing, but we do not want
                    // to reveal that information in case an attacker is fuzzing the
                    // system to discover which email addresses are registered.
                    // However, this information might be leaked anyway if the only
                    // cause of an error is a unique key constraint.  This potential
                    // information leak should be evaluated.
                    req.session.registrationError = 'Unable to create the account.  Please try again in a few minutes, or reset your password if you are already registered.';
                    req.session.registrationForm = registrationForm;
                    res.redirect(303, '/auth/register');
                    return;
                }

                // User was created successfully.  Redirect to confirmation page.
                // TODO: Verify email ownership
                res.redirect('/auth/register/success');
            });
        });
    });
});

module.exports = router;
