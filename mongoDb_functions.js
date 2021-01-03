// http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/   //<==
// http://mongodb.github.io/node-mongodb-native/3.4/tutorials/collations/      // collection.functions


export const insertDocuments = function (dd, callback) {
  const db = client.db(dbName);         //Это должно быть прописано именно в теле функции, а не заявлено на одном с ней уровне. (!)
  const collection = db.collection('documents');
  
  collection.insertMany(dd, function (err, result) {    //dd = [{a: 1}, {a: 2}, {a: 3}]
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

export const findDocuments = function (artistMarker, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.find({a: 55}, {b: 33}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирована вторым аргументом при вызове findDocuments(), что прописано в app.get('/artists/:id', ...).
  });                  //docs - [] со всеми item, у которых есть поля по типу {a: 55} и {b: 33}.
}

//Добавить НОВОЕ ПОЛЕ в ПЕРВЫЙ попавшийся item, у которого { a : 2 }, или ПЕРЕТЕРЕТЬ значение этого поля новым значением {a: 55}.
export const updateDocument = function (dd, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

// Update document where a is 2, set b equal to 1
  collection.updateOne({a: 2}, {$set: {a: 55}}, function (err, result) {     //{ _id: 5ff08f2ff64c8d7d28fc099b} - не прокатывает.
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated result ==>", result.result);  // { n: 1, nModified: 0, ok: 1 }
    callback(result);
  });
}

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


//Функции можно вкладывать одну в другую
insertDocuments(artist, function() {   //Вкладываем одну функцию в другую: сначала добавили и, как коллбэк, - нашли.
  findDocuments(artistMarker, function() {
    client.close();
  });
});


















