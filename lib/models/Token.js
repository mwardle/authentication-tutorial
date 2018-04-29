const createModel = require('./createModel');

const Token = createModel('Token', {
    collection: 'tokens',
    properties: {
        _id: {
            type: 'objectid',
        },
        userId: {
            type: 'objectid',
        },
        type: {
            type: 'enumeration',
            allowedValues: [
                'Bearer',
                'Refresh',
            ],
        },
        value: {
            type: 'string',
        },
        expiresAt: {
            type: 'datetime',
        },
    },
    indexes: [
        {
            name: 'valueUniqueIndex',
            fields: {type: 1, value: 1},
            unique: true,
        },
        {
            name: 'lookupIndex',
            fields: {type: 1, value: 1, expiresAt: -1},
        },
    ],
});

module.exports = Token;
