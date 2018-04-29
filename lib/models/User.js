const createModel = require('./createModel');

const User = createModel('User', {
    collection: 'users',
    properties: {
        _id: {
            type: 'objectid',
        },
        email: {
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
            name: 'emailUniqueIndex',
            fields: {email: 1},
            unique: true,
        },
    ],
});

module.exports = User;
