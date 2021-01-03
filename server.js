var express = require('express');
var bodyParser = require('body-parser');



// =MongoDB
//1. Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'myproject';
const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});



var app = express();    //экземпляр сервера
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var initialArtists = [
  {
    id: 1,
    name: 'Kola'
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
  res.send('Hello express');            //это выведется в броузере при http://localhost:3012
});

app.get('/artists', function (req, res) {   //http://localhost:3012/artists
  console.log("artist");
  res.send(artists);
});

// app.get('/artists/:id', function (req, res) {    //запрос КОНКРЕТНОГО артиста по ДИНАМИЧЕСКОМУ РОУТУ //http://localhost:3012/artists/2
//   console.log('req.params.id', req.params.id);
//   var artist = artists.find(function (artist) {
//     return artist.id === Number(req.params.id);
//   })
//   res.send(artist);
// });

app.get('/artists/:id', function (req, res) {
  var artistMarker = {name: req.params.id};
  
  findDocuments(artistMarker, function (docs) {
    res.send(docs);
    client.close();
  });
})

// app.post('/artists', function (req, res) {
//   var artist = {
//     name: req.body.name
//   };
//   console.log('app.post ===', artist)
//
//   const db = client.db(dbName);
//
//   insertDocuments(artist, function (docs) {
//     console.log('docs ==', docs)
//     res.send(docs);
//     client.close();
//   });
//
// })

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



//2. MongoDB methods.
const db = client.db(dbName);                         // Get the db.
const collection = db.collection('documents');  // Get the documents collection

const initialInsertDocuments = function (initialArtists, callback) {
  collection.insertMany(initialArtists, function (err, result) {   // Insert some documents
    assert.equal(err, null);
    // assert.equal(3, result.result.n);
    // assert.equal(3, result.ops.length);
    callback();
  });
}

const findDocuments = function (artistMarker, callback) {
  collection.find(artistMarker).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирована вторым аргументом при вызове findDocuments(), что прописано в app.get('/artists/:id', ...).
  });
}


//3.
client.connect(function (err) {
  assert.equal(null, err);
  console.log("MongoDb connected to server successfully");
  
  initialInsertDocuments(initialArtists, function() {      //грузим в MongoDb изачальные данные
    client.close();
  });
  
  app.listen(3012, function () {        //запускаем прослушивание express'a.
    console.log('express.listen started')      //это сработает при запуске сервера. Надпись появиться в консоле.
  })
  
});


