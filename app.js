require('dotenv').config({silent: true});
const env = require('read-env').default('MYAPP');

const {resolve} = require('path');

const express = require('express');

const sessionMiddleware = require('./lib/middleware/session');
const enforceAuthentication = require('./lib/middleware/enforceAuthentication');

const {setMongoUri} = require('./lib/models/getMongoConnection');

const {
    // In production, you will likely be using a proxy server (i.e. nginx).
    // See http://expressjs.com/en/4x/api.html#trust.proxy.options.table
    // for information on how to use this option.
    trustProxy = false,

    listenPort = 4000,

    mongodbUri = 'Invalid URI',
} = env;

// set up mongo
setMongoUri(mongodbUri);

const staticDir = resolve(__dirname, 'public');

const app = express();

app.set('trust proxy', trustProxy);
app.set('view engine', 'ejs');
app.set('views', 'templates');
app.use('/public', express.static(staticDir));
app.use(sessionMiddleware(env));
app.use(enforceAuthentication(['/auth/login']));

app.use(require('./lib/routers/authRouter'));
app.use(require('./lib/routers/adminRouter'));

app.listen(listenPort, () =>
{
    console.log(`listening at port ${listenPort}`);
});
