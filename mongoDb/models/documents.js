//имя файла - по имени коллекции в данной базе данных
//К слову, база данных тоже имеет свое имя - const dbName = 'myproject'.
const assert = require('assert');
var ObjectID = require('mongodb').ObjectID
var mongoClient = require('../mongoClient');
const dbName = 'myproject'

exports.initialInsertDocuments = function (initialArtists, callback) {
  mongoClient.callCollection(dbName, 'documents').insertMany(initialArtists, function (err, result) {   // Insert some documents
    assert.equal(err, null);
    callback();
  });
}

exports.findAllDocuments = function (dd, callback) {     //dd здесь не востребовано.
  mongoClient.callCollection(dbName, 'documents').find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

exports.findDocuments = function (artistMarker, callback) {
  mongoClient.callCollection(dbName, 'documents').find(artistMarker).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирован вторым аргументом при вызове findDocuments(), что прописан в app.get('/artists/:id', ...).
  });                  //docs - [] со всеми item, у которых есть поле по типу artistMarker.
}

exports.findOne = function (id, callback) {
  mongoClient.callCollection(dbName, 'documents').findOne({ _id: ObjectID(id) }, function (err, doc) {
    assert.equal(err, null);
    callback(doc);
  });
}

exports.updateDocument = function (body, callback) {
  mongoClient.callCollection(dbName, 'documents').updateMany(body[0], {$set: body[1]}, function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

exports.updateOneId = function (dd, callback) {
  mongoClient.callCollection(dbName, 'documents').updateOne({ _id: ObjectID(dd[0])}, {$set: dd[1]}, function (err, result) {     //dd[0] = id, dd[1] = {"a": 2020202}
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated result ==>", result.result);  // { n: 1, nModified: 0, ok: 1 }
    callback(result);
  });
}

