const argon2 = require('argon2');

const User = require('../models/User');

const Authenticator = module.exports;

Authenticator.authenticate = function authenticateUser(credentials, callback)
{
    const {
        email,
        password,
    } = credentials;

    if (typeof email !== 'string')
    {
        setImmediate(callback, null, null);
        return;
    }

    User.findOne({email}, (err, user) =>
    {
        if (user == null)
        {
            callback(err, null);
            return;
        }

        const {hashedPassword} = user;

        // We test the hash value's prefix so that if we ever need to update the
        // algorithm we are using, we will be able to figure out which algorithm
        // was used when we originally generated the hash.  For a discussion
        // on this topic see https://veggiespam.com/painless-password-hash-upgrades/
        if (/^\$argon2id\$/.test(hashedPassword))
        {
            argon2.verify(hashedPassword, password)
                .then((match) =>
                {
                    if (match)
                    {
                        // Password is good!
                        // TODO: log this for auditing
                        callback(null, user);
                    }
                    else
                    {
                        // Invalid password!
                        // TODO: log this for auditing
                        callback(null, null);
                    }
                })
                .catch((err) =>
                {
                    // Argon2 had an internal error
                    // TODO: log this as a critical failure
                    callback(err);
                })
            ;
        }
        else
        {
            callback(new Error('Unknown hashing algorithm'));
        }
    });
};

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
