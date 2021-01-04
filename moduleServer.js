const express = require('express');
const bodyParser = require('body-parser');
const assert = require('assert');
const mongoClient = require('./mongoDb/mongoClient');
const docModels = require('./mongoDb/models/documents');
const docControllers = require('./mongoDb/controllers/documents');
const initialData = require('./mongoDb/initialData');


//=СЕРВЕР=
var app = express();    //экземпляр сервера
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//роуты сервера
app.get('/', docControllers.findAllDocuments)   //это выведется в броузере при http://localhost:3012
app.get('/all_artists', docControllers.findAllDocuments)
//нельзя существовать роуту app.get('/artists', ...) вместе с роутом app.get('/artists/:id', ...). Перетирают один другого.
app.get('/artists/:id', docControllers.findDocuments)
app.get('/artist/:id', docControllers.findOne)
app.put('/artists', docControllers.updateDocument)
app.put('/artist/:id', docControllers.updateOneId)


//MongoDB, загруз в db начальных данных и запуск просушивания портов by сервером.
mongoClient.buildClient().connect(function (err) {
  assert.equal(null, err);
  console.log("= MongoDb connected to server successfully");
  
  docModels.initialInsertDocuments(initialData.artists, function() {      //грузим в MongoDb изначальные данные.
    console.log('=initial_documents_is_inserted')
  })
  
  app.listen(3012, function () {                   //запускаем прослушивание express'a, причем ПОСЛЕ соединения с db.
    console.log('=express_listening_is_started')      //это сработает при запуске сервера. Надпись появиться в консоле.
  })
});


