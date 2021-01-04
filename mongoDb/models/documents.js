//имя файла - по имени коллекции в данной базе данных
//К слову, база данных тоже имеет свое имя - const dbName = 'myproject'.

const assert = require('assert');
var mongoClient = require('../mongoClient');

exports.all = function (cb) {
  mongoClient.dbCollection().collection('artists').find().toArray(function (err, docs) {
    cb(err, docs);
  })
}




exports.findAllDocuments = function (dd, callback) {     //dd здесь не востребовано.
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}
