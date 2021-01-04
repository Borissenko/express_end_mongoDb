var express = require('express');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID

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
app.get('/', function (req, res) {
  // res.send('Hello API');            //это выведется в броузере при http://localhost:3012
  
  findAllDocuments(null, function (docs) {
    res.send(docs);
  });
});

app.get('/all_artists', function (req, res) {
  findAllDocuments(null, function (docs) {
    res.send(docs);
  });
})

//нельзя существовать роуту app.get('/artists', ...) вместе с роутом app.get('/artists/:id', ...). Перетирают один другого.

app.get('/artists/:id', function (req, res) {    //получение отфильтрованных членов, которые имеют поле {name: req.params.id}.
  var artistMarker = {name: req.params.id};

  findDocuments(artistMarker, function (docs) {
    res.send(docs);
  });
})

app.get('/artist/:id', function (req, RES) {    //получение данных по члену с конкретным id.
  let id = req.params.id;
  
  findOne(id, function (doc) {
    RES.send(doc);
  });
})

app.put('/artists', function (req, res) {
  updateDocument(req.body, function (docs) {
    res.send(docs);  //или res.sendStatus(200)
  });
})

app.put('/artist/:id', function (req, res) {  //обновление поля у конкретного по id члена.
  let dd = [req.params.id, req.body]
  
  updateOneId(dd, function (result) {
    res.sendStatus(200);         //возвращаем подтверждение, что все прошло успешно. Обратно на фронт в теле ответа придет "OK".
  });
})

//=MongoDB=
//1. Connect to MongoDB
// const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// const dbName = 'myproject';
// const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});

var mongoClient = require('./mongoDb/mongoClient');
let client = mongoClient.buildClient()

let dbName = 'myproject';


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

const findDocuments = function (artistMarker, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.find(artistMarker).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирован вторым аргументом при вызове findDocuments(), что прописан в app.get('/artists/:id', ...).
  });                  //docs - [] со всеми item, у которых есть поле по типу artistMarker.
}

const findOne = function (id, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.findOne({ _id: ObjectID(id) }, function (err, doc) {
    assert.equal(err, null);
    callback(doc);
  });
}

const updateDocument = function (body, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.updateMany(body[0], {$set: body[1]}, function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

const updateOneId = function (dd, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  
  collection.updateOne({ _id: ObjectID(dd[0])}, {$set: dd[1]}, function (err, result) {     //dd[0] = id, dd[1] = {"a": 2020202}
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated result ==>", result.result);  // { n: 1, nModified: 0, ok: 1 }
    callback(result);
  });
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


