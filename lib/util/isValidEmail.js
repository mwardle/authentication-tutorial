function isValidEmail(email)
{
    if (typeof email !== 'string')
    {
        return false;
    }

    // source: https://www.regular-expressions.info/email.html
    return /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email);
}

module.exports = isValidEmail;
