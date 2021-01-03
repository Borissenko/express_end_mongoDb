var express = require('express');
var bodyParser = require('body-parser');

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

//=СЕРВЕР=
var app = express();    //экземпляр сервера
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//роуты сервера
app.get('/all_artists', function (req, res) {
  findAllDocuments(null, function (docs) {
    res.send(docs);
  });
})

//нельзя существовать роуту app.get('/artists', ...) вместе с роутом app.get('/artists/:id', ...). Перетирают один другого.

app.get('/artists/:id', function (req, res) {
  var artistMarker = {name: req.params.id};
  
  findDocument(artistMarker, function (docs) {
    res.send(docs);
  });
})


//=MongoDB=
//1. Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'myproject';
const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});


//2. MongoDB methods.
const initialInsertDocuments = function (initialArtists, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.insertMany(initialArtists, function (err, result) {   // Insert some documents
    assert.equal(err, null);
    callback();
  });
}

const findAllDocuments = function (dd, callback) {     //dd здесь не востребовано.
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

const findDocument = function (artistMarker, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.find(artistMarker).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирован вторым аргументом при вызове findDocument(), что прописан в app.get('/artists/:id', ...).
  });                  //docs - [] со всеми item, у которых есть поле по типу artistMarker.
}


//3. Загруз в db начальных данных и запуск просушивания портов by сервером.
client.connect(function (err) {
  assert.equal(null, err);
  console.log("= MongoDb connected to server successfully");
  
  initialInsertDocuments(initialArtists, function() {      //грузим в MongoDb изначальные данные.
    console.log('=initialInsertDocuments')
  });
  
  app.listen(3012, function () {                   //запускаем прослушивание express'a, причем ПОСЛЕ соединения с db.
    console.log('=express listening started')      //это сработает при запуске сервера. Надпись появиться в консоле.
  })
});


