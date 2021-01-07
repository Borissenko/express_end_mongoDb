const MongoClient = require('mongodb').MongoClient;

let client = null;

exports.buildClient = function () {
  return client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});
}

exports.callCollection = function (dbName, collectionName) {
  const db = client.db(dbName);
  return  db.collection(collectionName);
}

