// Important note:
//      This code is solely written for the purpose of this tutorial
//      and should never be used in production.

const getMongoConnection = require('./getMongoConnection');

function createModel(name, options)
{
    const {
        collection,
        properties = {},
        indexes = [],
    } = options;

    const Model = function(data = {})
    {
        const instance = {__proto__: Model.prototype};
        Object.keys(properties).forEach((propKey) =>
        {
            instance[propKey] = data[propKey];
        });

        return instance;
    };

    Model.insertOne = function insert(instance, callback)
    {
        const connection = getMongoConnection();
        connection.collection(collection).insertOne(instance, callback);
    };

    Model.find = function find(query, options, callback)
    {
        if (arguments.length === 2)
        {
            callback = options;
            options = null;
        }

        const connection = getMongoConnection();
        connection.collection(collection).find(query, options, callback);
    };

    Model.findOne = function findOne(query, options, callback)
    {
        if (arguments.length === 2)
        {
            callback = options;
            options = null;
        }

        const connection = getMongoConnection();
        connection.collection(collection).findOne(query, options, callback);
    };

    Model.updateOne = function updateOne(instance, options, callback)
    {
        if (arguments.length === 2)
        {
            callback = options;
            options = null;
        }

        const connection = getMongoConnection();
        const query = {_id: instance._id};
        connection.collection(collection).updateOne(query, instance, options, callback);
    };

    Model.deleteOne = function deleteOne(instance, options, callback)
    {
        if (arguments.length === 2)
        {
            callback = options;
            options = null;
        }

        const connection = getMongoConnection();
        const query = {_id: instance._id};
        connection.collection(collection).deleteOne(query, options, callback);
    };

    return Model;
}

module.exports = createModel;
