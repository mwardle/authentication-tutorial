const express = require('express');
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

module.exports = router;
