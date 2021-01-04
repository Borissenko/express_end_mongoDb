## Подключение MongoDB (version - 4.4).

#1) Устанавливаем MongoDB на ноутбук, глобально.
https://docs.mongodb.com/guides/server/install/
http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/

MongoDB имеет 2 разновидности: Community and Enterprise(предприятие).

Для личного пользования на Убунте установка описана здесь:
  https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

Далее запускаем mongodb-сервер. Пока он запущен, датабаза - существует. (Вранье)
Поэтому express и mongodb мы должны запускать параллельно в разных вкладках консоли,
сначало bd, затем express.

>mongod
или по туториалу:
>sudo systemctl start mongod

Команды по датабазе:
> sudo systemctl start mongod
> sudo systemctl status mongod       //проверяем, запущена ли MongoDB.
> sudo systemctl stop mongod
> sudo systemctl restart mongod
> Ctrl+C          //Остановить mongodb-сервер(вранье)



#2) В ПРОЕКТЕ
#0. Устанавливаем В ПРОЕКТ спец драйвер - mongodb.
>npm install mongodb --save


#1. Подсоединяем проект к MongoDB, которая установлена на ноутбуке. Подсоединяем via MongoClient.
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'myproject';
const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});  //{useNewUrlParser: true} нужен при insertDocuments().

//Порт localhost:27017 - всегда стандартный.



#2. Описываем необходимые нам манипуляции с данными db.
http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/   //<==
http://mongodb.github.io/node-mongodb-native/3.4/tutorials/collations/

const initialInsertDocuments = function (initialArtists, callback) {
  const db = client.db(dbName);         //Это должно быть прописано именно в теле функции, а не заявлено на одном с ней уровне. (!)
  const collection = db.collection('documents');

  collection.insertMany(initialArtists, function (err, result) {     //initialArtists = [{}, ]
    assert.equal(err, null);
    callback();
  });
}

const findAllDocuments = function (ss, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

const findDocument = function (artistMarker, callback) {          //artistMarker = {name: req.params.id}; или {name: "Kola"}
  const db = client.db(dbName);  
  const collection = db.collection('documents');

  collection.find(artistMarker).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирована вторым аргументом при вызове findDocuments(), что прописано в app.get('/artists/:id', ...).
  });
}




#3. Загруз в db начальных данных и 
# запуск просушивания портов by сервером 
# после срабатывания у db его обработчика события client.connect.

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



#4. Декларируем в express'e его роуты и добавляем в них команды запуска избранных функций MongoDb.

//Запрос на получения полных данных по определенному артисту- с именем "Kola".
//Запрос http://localhost:3012/artists/Kola

app.get('/all_artists', function (req, RES) {
  findAllDocuments(null, function (docs) {
    RES.send(docs);
  });
})

//нельзя сосуществовать роуту app.get('/artists', ...) 
//вместе с роутом app.get('/artists/:id', ...). Они имеют схожие сегменты и перетирают один другого.

app.get('/artists/:id', function (req, RES) {
  var artistMarker = {name: req.params.id};

  findDocuments(artistMarker, function (docs) {      //artistMarker = {name: "Kola"}
    RES.send(docs);
  });
})




#5. Запускаем MongoDb и express в 2 разных терминалах.
>sudo systemctl start mongod    //из любого места
>node server.js                 //находясь рядом с server.js, где задекларирован express.

Открываем Postman и делаем на сервер express запрос
Метод - get,
URL - http://localhost:3012/all_artists
body - не используем.
В окне у Postman'a видим response от запроса.

Метод - get,
URL - http://localhost:3012/artists/Kola
body - не используем.

//обращение к серверу из броузера -  http://localhost:3012, 
//в броузере увидим 'Hello API'.




#6. Разбиваем MongoDb на несколько файлов.
//db.js - его будем импортировать в mainMongoDb.js
//Здесь мы заявляем client'a.
//Это позволяет быть тому, чтобы client.connect был синглтоном.

//Здесь я код не причесывал.

var state = {
  db: null
};

exports.get = function () {
  return state.db;
}


//mainMongoDb.js
var db = require('./db');

let aa = db.get()









