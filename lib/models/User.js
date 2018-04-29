const createModel = require('./createModel');

const User = createModel('User', {
    collection: 'users',
    properties: {
        _id: {
            type: 'objectid',
        },
        emailAddress: {
            type: 'string',
            validationType: 'email',
        },
        hashedPassword: {
            type: 'string',
            sensitive: true,
        },
    },
    indexes: [
        {
            name: 'emailAddressUniqueIndex',
            fields: {emailAddress: 1},
            unique: true,
        },
    ],
});

module.exports = User;
