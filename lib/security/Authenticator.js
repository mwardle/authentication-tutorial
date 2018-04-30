const Authenticator = module.exports;

Authenticator.authenticate = function authenticateUser(credentials, callback)
{
    // TODO: authenticate
    callback(new Error('Not Implemented'));
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
    // TODO: actually encrypt the password
    setImmediate(callback, new Error('Not Implemented'));
};
