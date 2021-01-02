var express = require('express');
var bodyParser = require('body-parser');

var db;

var app = express();    //экземпляр сервера
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var artists = [
  {
    id: 1,
    name: 'Metallica'
  },
  {
    id: 2,
    name: 'Iron Maiden'
  },
  {
    id: 3,
    name: 'Deep Purple'
  }
];

//роуты сервера
app.get('/', function (req, res) {
  res.send('Hello API');            //это выведется в броузере при http://localhost:3012
});

app.get('/artists', function (req, res) {   //http://localhost:3012/artists
  console.log("artist");
  res.send(artists);
});

app.get('/artists/:id', function (req, res) {    //запрос КОНКРЕТНОГО артиста по ДИНАМИЧЕСКОМУ РОУТУ //http://localhost:3012/artists/2
  console.log('req.params.id', req.params.id);
  var artist = artists.find(function (artist) {
    return artist.id === Number(req.params.id);
  })
  res.send(artist);
});


app.post('/artists', function (req, res) {
  var artist = {
    name: req.body.name
  };
  console.log('app.post ===', artist)
  
  // db.collection('artists').insert(artist, (err, result) => {    // NO working. ))
  //   if (err) {
  //     console.log(err);
  //     return res.sendStatus(500);
  //   }
  //   res.send(artist);  //Возврат сохраняемого артиста- НУЖЕН, т.к. в bd ему присуждается _id, который нам на фронте понадобиться.
  // })
  
  const db = client.db(dbName);
  
  findDocuments(db, function (docs) {
    console.log('docs ====\\', docs)
    res.send(docs);
    client.close();
  });
  
})


app.put('/artists/:id', function (req, res) {
  var artist = artists.find(function (artist) {
    return artist.id === Number(req.params.id)
  });
  artist.name = req.body.name;  //копирование var artist прошло ССЫЛКОЙ(!), поэтому при изменении поля name у var artist измениться и абъект в массиве artists(!).
  res.sendStatus(200);
})

app.delete('/artists/:id', function (req, res) {
  artists = artists.filter(function (artist) {
    return artist.id !== Number(req.params.id)
  })
  res.sendStatus(200);
})


//входной порт сервера. Если используем MongoClient, то app.listen() - закомментариваем, т.к. код переносим в MongoClient.connect().
// app.listen(3012, function () {
//   console.log('API app started')     //это сработает при запуске сервера. Надпись появиться в консоле
// })
//
//запуск сервера -  node server.js,
//обращение к серверу из броузера -  http://localhost:3012, в броузере увидим 'Hello API'.


//1. Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'myproject';
const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});


//2. ..............
const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  
  // Insert some documents
  collection.insertMany([                  //.insertOne({a:1}, ...)
    {a: 1}, {a: 2}, {a: 3}
  ], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    
    console.log("result ==", result);
    callback(result);
  });
}

const findAllDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    
    console.log("docs ==", docs);
    callback(docs);
  });
}

const findDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    
    console.log("docs ==", docs);
    callback(docs);
  });
}

const findDocuments_0 = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  
  // Find some documents
  collection.find({a: 55}, {b: 33}).toArray(function (err, docs) {
    assert.equal(err, null);
    
    console.log("findDocuments) ==");
    callback(docs);
  });
}

//Добавление НОВОГО ПОЛЯ в ПЕРВЫЙ попавшийся item, у которого { a : 2 }, или ПЕРЕТЕРЕТЬ значение этого поля новым значением.
const updateDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  
  // Update document where a is 2, set b equal to 1
  collection.updateOne({a: 1}                         //{ _id: 5ff08f2ff64c8d7d28fc099b} - не прокатывает. ))
    , {$set: {a: 55}}, function (err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      
      console.log("Updated result ==>", result.result);  // { n: 1, nModified: 0, ok: 1 }
      callback(result);
    });
}

const removeDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  
  // Delete ОДИН, ПЕРВЫЙ document where a is 3
  collection.deleteOne({a: 3}, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    
    console.log("Removed result ==", result.result);   // result: { n: 1, ok: 1 },
    callback(result);
  });
}
const indexCollection = function (db, callback) {   //польза непонятна.
  db.collection('documents').createIndex(
    {"a": 1},
    null,
    function (err, results) {
      console.log(results);
      callback();
    }
  );
};


// ........................
//3. Use connect method to connect to the server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  
  app.listen(3012, function () {
    console.log('API app started')     //это сработает при запуске сервера. Надпись появиться в консоле
  })
  
  // const db = client.db(dbName);
  //
  // findDocuments(db, function () {
  //   client.close();
  // });
  
  // insertDocuments(db, function() {
  //   client.close();
  // });
  
  // findDocuments(db, function () {
  //   client.close();
  // });
  
  // insertDocuments(db, function() {   //сначало добавили и, как коллбэк - нашли.
  //   findDocuments(db, function() {
  //     client.close();
  //   });
  // });
  
  // indexCollection(db, function() {
  //   client.close();
  // });
  
  // findAllDocuments(db, function() {
  //   client.close();
  // });
  
});




