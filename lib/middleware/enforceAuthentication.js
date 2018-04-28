module.exports = function createEnforceAuthenticationMiddleware(options)
{
    const {
        // login routes, etc
        ignore = [],

        // where to go to login
        loginUrl,
    } = options;

    return function enforceAuthentication(req, res, next)
    {
        if (ignore.includes(req.path))
        {
            return next();
        }

        // TODO: perform authentication
        return next();
    };
};
