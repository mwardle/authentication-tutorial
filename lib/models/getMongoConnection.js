// Important note:
//      This code is solely written for the purpose of this tutorial
//      and should never be used in production.

const MongoClient = require('mongodb').MongoClient;

let client = null;

function getMongoConnection()
{
    return client && client.db();
}

getMongoConnection.setMongoUri = function setMongoUri(uri)
{
    if (client !== null)
    {
        client.close();
    }

    MongoClient.connect(uri, (err, _client) =>
    {
        if (err)
        {
            throw (err);
        }

        client = _client;
    });
};

module.exports = getMongoConnection;
