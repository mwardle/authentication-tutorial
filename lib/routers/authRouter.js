const express = require('express');

const Authenticator = require('../security/Authenticator');

const router = express.Router();

router.get('/auth/login', (req, res) =>
{
    let errorMessage = '';
    if (req.session.loginError)
    {
        // Cycle the error message
        errorMessage = req.session.loginError;
        delete req.session.loginError;
    }

    res.render('pages/login', {errorMessage});
});

router.post('/auth/login', (req, res) =>
{
    const {
        email,
        password,
    } = req.body;

    Authenticator.authenticate({email, password}, (err, authData) =>
    {
        if (err != null)
        {
            // Login failed

            // TODO: Respond with 401 for XHR / json requests instead of a redirect
            req.session.loginError = 'Login failed.  Please check your email address and password and try again.';

            res.redirect(303, '/auth/login');
            return;
        }

        // Login worked!
        req.session.auth = authData;

        // Redirect to main page
        res.redirect(303, '/');
    });
});

module.exports = router;
