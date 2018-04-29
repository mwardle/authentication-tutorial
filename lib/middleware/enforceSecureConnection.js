function createEnforceSecureConnectionMiddleware(env)
{
    const {
        // Enforce secure connection by default
        enforceSecureConnection = true,
    } = env;

    return function enforceSecureConnectionMiddleware(req, res, next)
    {
        if (enforceSecureConnection && !req.secure)
        {
            const errorMessage = 'You must use a secure connection.  Try using a url that begins with https://.';
            res.status(403).render('pages/error', {errorMessage});
            return;
        }

        next();
    };
}

module.exports = createEnforceSecureConnectionMiddleware;
