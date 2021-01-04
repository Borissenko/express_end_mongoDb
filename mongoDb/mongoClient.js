const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'myproject';    //требуется для обращения к коллекции у данной базы данных.
let client = null;             //потребуется для отработки других exports-функций

exports.buildClient = function () {
  return new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});
}

// exports.ClientConnect = function (initialInsertDocuments, appListen) {
//   assert.equal(null, err);
//   console.log("= MongoDb connected to server successfully");
//
//   initialInsertDocuments()
//   appListen()
//
// }
//
// exports.dbCollection = function () {
//   const db = client.db(dbName);
//   return db.collection('documents');
// }
