const session = require('express-session');

// We are using mongodb as an example to avoid having to install multiple databases.
// I typically use https://www.npmjs.com/package/connect-redis for real projects.
const MongoStore = require('connect-mongo')(session);

const gentoken = require('../util/gentoken');

module.exports = function createSessionMiddleware(env)
{
    const {
        // Cookies should be secure in production.
        // Set to false in development if not using https.
        secureCookies = true,

        // An array of rotating session secrets used to sign the cookies.
        cookieSecrets = [],

        // Max cookie age defaults to 4 hours (in ms) in our sample application.
        // The actual value to use here depends on your application requirements:
        //   less time = degraded user experience but better security
        //   more time = enhanced user experience but worse security
        // The value should be >= the refresh token expiration time described later
        cookieMaxAge = 14400000,

        // URI for the mongodb auh (i.e. mongodb://user:pass@127.0.0.1:27017/myappsessions).
        mongodbSessionUri = null,
    } = env;

    // Persistent storage for session data
    const sessionStore = new MongoStore({
        url: mongodbSessionUri,
        collection: 'sessions',
        ttl: cookieMaxAge * 2,
    });

    const sessionConfig = {
        secure: secureCookies,
        secret: cookieSecrets,
        name: 'myapp.sid',
        resave: false,
        saveUninitialized: false,
        cookie: {
            // Do not allow the cookie to be read by client scripts in the browser.
            httpOnly: true,
            maxAge: cookieMaxAge,
            // Configure this based on application requirements
            sameSite: 'strict',
            secure: secureCookies,
        },
        store: sessionStore,
        genid: gentoken,
    };

    return session(sessionConfig);
};
