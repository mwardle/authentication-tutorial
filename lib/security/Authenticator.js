const argon2 = require('argon2');

const User = require('../models/User');

const Authenticator = module.exports;

Authenticator.validatePassword = function validatePassword(password, callback)
{
    // TODO: robust password validation
    if (typeof password !== 'string')
    {
        setImmediate(callback, new Error('The password is not valid.'));
        return;
    }

    // Important note: This is completely inadequate
    if (password.length < 8)
    {
        setImmediate(callback, new Error('The password must be at least 8 characters long.'));
        return;
    }

    setImmediate(callback, null);
};

Authenticator.encryptPassword = function encryptPassword(password, callback)
{
    argon2.hash(password, {timeCost: Authenticator.argon2Timecost, type: argon2.argon2id})
        .then(hash =>
        {
            callback(null, hash);
        })
        .catch((err) =>
        {
            // TODO: log this as a critical error
            callback(err);
        })
    ;
};

Authenticator.configure = function configureAuthenticator(env)
{
    const {
        argon2Timecost,
    } = env;

    Authenticator.argon2Timecost = argon2Timecost;
};
