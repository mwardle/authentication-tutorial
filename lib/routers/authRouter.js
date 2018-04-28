const express = require('express');
const router = express.Router();

router.get('/auth/login', (req, res) =>
{
    res.end('You have reached the login page.  This has not been written yet!');
});

module.exports = router;
