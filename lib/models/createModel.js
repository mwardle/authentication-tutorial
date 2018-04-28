// Important note:
//      This code is solely written for the purpose of this tutorial
//      and should never be used in production.

const getMongoConnection = require('./getMongoConnection');

function createModel(model, options)
{
    const {
        collection,
    } = options;

    model.insertOne = function insert(instance, callback)
    {
        const connection = getMongoConnection();
        connection.collection(collection).insertOne(instance, callback);
    };

    model.find = function find(query, options, callback)
    {
        if (arguments.length === 2)
        {
            callback = options;
            options = null;
        }

        const connection = getMongoConnection();
        connection.collection(collection).find(query, options, callback);
    };

    model.findOne = function findOne(query, options, callback)
    {
        if (arguments.length === 2)
        {
            callback = options;
            options = null;
        }

        const connection = getMongoConnection();
        connection.collection(collection).findOne(query, options, callback);
    };

    model.updateOne = function updateOne(instance, options, callback)
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

    model.deleteOne = function deleteOne(instance, options, callback)
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
}

module.exports = createModel;
