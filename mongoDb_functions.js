// http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/   //<==
// http://mongodb.github.io/node-mongodb-native/3.4/tutorials/collations/      // collection.functions


export const insertDocuments = function (dd, callback) {
  const db = client.db(dbName);         //Это должно быть прописано именно в теле функции, а не заявлено на одном с ней уровне. (!)
  const collection = db.collection('documents');
  
  collection.insertMany(dd, function (err, result) {    //dd = [{a: 1}, {a: 2}, {a: 3}], function(){} - это callback функция.
    assert.equal(err, null);
    callback(result);
  });
}

export const insertOneDocument = function (dd, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.insertOne(dd, function (err, result) {    //dd = {a: 1}
    assert.equal(err, null);
    callback(result);
  });
}

export const initialInsertDocuments = function (initialArtists, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.insertMany(initialArtists, function (err, result) {    //initialArtists = [{}, ]
    assert.equal(err, null);
    callback();
  });
}



export const findAllDocuments = function (ss, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);  //docs - [] со всеми item, у которых есть поле по типу artistMarker.
  });
}

//найти, ОТФИЛЬТРОВАВ и отсортировав.
export const findDocuments = function (artistMarker, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.find({a: 55}, {b: 33}).sort({age: -1}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирована вторым аргументом при вызове findDocuments(), что прописано в app.get('/artists/:id', ...).
  });                  //docs - [] со всеми item, у которых есть поля по типу {a: 55} и {b: 33}.
}

//Найти по id и вернуть все данные этого item'a.
var ObjectID = require('mongodb').ObjectID    //(!)

const findOne = function (id, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.findOne({ _id: ObjectID(id) }, function (err, doc) {
    assert.equal(err, null);
    callback(doc);    //callback() задекларирован вторым аргументом при вызове findDocument(), что прописан в app.get('/artists/:id', ...).
  });
}


//Добавить НОВОЕ ПОЛЕ в ПЕРВЫЙ попавшийся item (updateOne), у которого { a : 2 }, или ПЕРЕТЕРЕТЬ значение этого поля новым значением {a: 55}.
export const updateFirstDocument = function (body, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.updateOne(body[0], {$set: body[1]}, function (err, result) {
    assert.equal(err, null);
    callback(result);
  });
}

// Запрос PUT
// на URL http://localhost:3012/artists
// с телом
// [{"a": 2}, {"a": 222}]


//Добавить НОВОЕ ПОЛЕ во ВСЕ items (updateMany), у которого { a : 2 }, или ПЕРЕТЕРЕТЬ имеющееся поле.
export const updateDocument = function (body, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.updateMany(body[0], {$set: body[1]}, function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

//Добавить НОВОЕ ПОЛЕ в items с конкретным id.
export const updateOneId = function (dd, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.updateOne({ _id: ObjectID(dd[0])}, {$set: dd[1]}, function (err, result) {     //dd[0] = id, dd[1] = {"a": 2020202}
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated result ==>", result.result);  // { n: 1, nModified: 0, ok: 1 }
    callback(result);
  });
}

// Запрос PUT
// на URL http://localhost:3012/artist/5ff0890c8041137a32b29770
//   с телом
// {"a": 2020202}



export const removeDocument = function (dd, callback) {    //удалить item, у которого есть поле "a: 3.
  const db = client.db(dbName);
  const collection = db.collection('documents');

  // Delete ОДИН, ПЕРВЫЙ document where a is 3
  collection.deleteOne(dd, function (err, result) {    //dd = {a: 3}
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed result ==", result.result);   // result: { n: 1, ok: 1 },
    callback(result);
  });
}


//Удалить item с данным id.
var ObjectID = require('mongodb').ObjectID

export const removeIdItem = function (id, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

  collection.deleteOne({ _id: ObjectID(id) }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed result ==", result.result);   // result: { n: 1, ok: 1 },
    callback(result);
  });
}


export const indexCollection = function (db, callback) {   //польза непонятна.
  db.collection('documents').createIndex(
    {"a": 1},
    null,
    function (err, results) {
      console.log(results);
      callback();
    }
  );
};



// ...................

//Функции можно вкладывать одну в другую
insertDocuments(artist, function() {   //Вкладываем одну функцию в другую: сначала добавили и, как коллбэк, - нашли.
  findDocuments(artistMarker, function() {
    client.close();
  });
});



find().sort().toArray()
findOneAndUpdate() // ??? Because Gunter is lexically first in the collection, the above operation returns no(!) results and updates no documents.
findOneAndDelete()















