const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
{
    res.render('pages/admin');
    // res.end('You have reached the admin page.  That means you must be logged in!');
});

module.exports = router;
