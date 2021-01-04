# Источник - семинар https://monsterlessons.com/project/series/pishem-api-na-nodejs

#1. Установка node на ноутбук via nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

nvm install 8.9.2
nvm install 10.9.2

Все пакеты лежат здесь, и можно посмотреть, какие пакеты каждая версия содержит, и удалить какую-нибудь версию вручную.
ls ~/.nvm/versions/node/                               //v10.04.0 v12.19.0
ls ~/.nvm/versions/node/v12.19.0/lib/node_modules      //npm  @vue

nvm list
nvm use 5.9

проверка, что активно
node -v
npm -v


#2. Установка EXPRESS
npm init     //создаем болванку package.json
npm i express --save


//server.js
var express = require('express');

var app = express();    //экземпляр сервера

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
  res.send(artists);
});

app.get('/artists/:id', function (req, res) {    //запрос КОНКРЕТНОГО артиста по ДИНАМИЧЕСКОМУ РОУТУ //http://localhost:3012/artists/2
  var artist = artists.find(function (artist) {
    return artist.id === Number(req.params.id);
  })
  res.send(artist);
});


//входной порт сервера, который он слушает
app.listen(3012, function () {
  console.log('API app started')     //это сработает при запуске сервера. Надпись появиться в консоле
})

//запуск сервера
> node server.js
//обращение к серверу из броузера, и в броузере мы увидим 'Hello API'
> http://localhost:3012




# JSON Viewer - что бы JSON-файл отображался в броузере красиво можно установить в броузер плагин "JSON Viewer".



#3. POST-запросы.

Что бы парсить тело запроса ставим на сервере
npm install body-parser --save

//server.js
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/artists', function (req, res) {
  var artist = {
    id: Date.now(),
    name: req.body.name
  }
  artists.push(artist);   //Здесь переменная artists выступает пока в роли db.
  res.send(artist);
})

//Список artist выведется в броузере при http://localhost:3012


# Postman - что бы не писать фронтенд, который бы отправлял бы нам POST-запросы будем использовать Postman.

https://identity.getpostman.com/signup?continue=https%3A%2F%2Fgo.postman.co%2Fbuild
вэб-версия, не работает -https://web.postman.co/workspace/ea26f38d-0be3-44c2-8faa-802a0e9bb9d2/request/create?requestId=2820876a-37b9-4fbf-ba75-a9b059ae0cad
Как пользоваться - https://losst.ru/kak-polzovatsya-postman

Установка Postman'a:
$ sudo apt update
$ sudo apt install snapd
$ sudo snap install postman

Далее запускаю через иконку, которая появиться среди всех прогремм Убунты,
захожу в свой аккаунт через Google
https://identity.getpostman.com/signup?continue=https%3A%2F%2Fgo.postman.co%2Fbuild

В нем мы указываем наш адрес http://localhost:3012/artists
тип запроса - POST
В закладке body включаем раздел row  и тип вводимого - JSON.
Для тела запроса прописываем
{"name": "Kola"}

Перезапускаем сервер,
в окне postman жмем Send
и в postman в окошечке чуть ниже увидим пришедший с сервера ответ
{
  "id": 1609582962553,
  "name": "Kola"
}



# PUT-запросы (обновление).
У конкретного артиста меняем значение его поля "name" на значение "Ola".

app.put('/artists/:id', function (req, res) {
  var artist = artists.find(function (artist) {
    return artist.id === Number(req.params.id)
  });
  artist.name = req.body.name;   //копирование var artist прошло ССЫЛКОЙ(!), поэтому при изменении поля name у var artist измениться и абъект в массиве artists(!).
  res.sendStatus(200);           //обратно на фронт придет "OK", указывая, что запрос прошел успешно.
})

А запрос шлем PUT
на URL http://localhost:3012/artists/2
с телом
{"name": "Ola"}

В ответе получаем "OK".



# DEL-запрос.
Аналогично.
Тело запроса не формируем.
Кого удаляем - прописываем в URL


app.delete('/artists/:id', function (req, res) {
  artists = artists.filter(function (artist) {
    return artist.id !== Number(req.params.id)
  })
  res.sendStatus(200);
})



##############
#4. mongodb (version - 4.4)
//см инструкцию из mongoDb_functions.js

# Get-запрос
app.get('/all_artists', function (req, RES) {
  findAllDocuments(null, function (docs) {
    RES.send(docs);
  });
})

const findAllDocuments = function (ss, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);   //проверка на ошибку. При ошибке генерирует исключение.
    callback(docs);
  });
}

Запрос via Postman 
GET
на URL http://localhost:3012/all_artists
без тела запроса.

Список docs можно увидеть в броузере по 
> http://localhost:3012

потому что мы прописали в роутах express
app.get('/', function (req, res) {
  findAllDocuments(null, function (docs) {
    res.send(docs);
  });
});



# Get-запрос селективный по полю. Запрашиваем данные артистОВ, у которых поле "name" равно "Kola".
app.get('/artists/:id', function (req, RES) {
  var artistMarker = {name: req.params.id};

  findDocuments(artistMarker, function (docs) {      //artistMarker = {name: "Kola"}
    RES.send(docs);
  });
})

const findDocuments = function (artistMarker, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

  collection.find(artistMarker).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирован вторым аргументом при вызове findDocument(), что прописан в app.get('/artists/:id', ...).
  });                  //docs - [] со всеми item, у которых есть поле по типу artistMarker.
}




# Get-запрос селективный BY _ID.
var ObjectID = require('mongodb').ObjectID    //(!)

app.get('/artists/:id', function (req, RES) {
  let id = req.params.id;

  findOne(id, function (doc) {
    RES.send(doc);
  });
})

const findOne = function (id, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

  collection.findOne({ _id: ObjectID(id) }, function (err, doc) {
    assert.equal(err, null);
    callback(doc);
  });
}


# POST-запрос
app.post('/artists', function (req, RES) {
  var artist = {
    id: Date.now(),
    name: req.body.name
  }

  insertOneDocument(artist, function () {
    RES.sendStatus(200);    //возвращаем подтверждение, что все прошло успешно. Обратно на фронт в теле ответа придет "OK".
  });
})

export const insertOneDocument = function (artist, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

  collection.insertOne(artist, function (err, result) {    //dd = {a: 1}
    assert.equal(err, null);
    callback();
  });
}


# PUT-запросы (обновление) ВСЕХ (updateMany).
У артистОВ меняем значение их полей {"a": 2} на значение 222.

app.put('/artists', function (req, res) {
  updateDocuments(req.body, function (docs) {
    res.send(docs);  //или res.sendStatus(200)
  });
})

const updateDocuments = function (body, callback) {
  const db = client.db(dbName);
  const collection = db.collection('documents');

  collection.updateMany(body[0], {$set: body[1]}, function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

Запрос PUT
на URL http://localhost:3012/artists
с телом
[{"a": 2}, {"a": 222}]



# PUT- запрос (обновление поля или добавление нового поля) у СЕЛЕКТИВНОГО item по id.  
//У item с id=33 его поле "a" обновиться на {"a": 2020202}

var ObjectID = require('mongodb').ObjectID    //(!)

app.put('/artist/:id', function (req, res) {
  let dd = [req.params.id, req.body]

  updateOneId(dd, function (result) {
    res.sendStatus(200);         //возвращаем подтверждение, что все прошло успешно. Обратно на фронт в теле ответа придет "OK".
  });
})

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

  Запрос PUT
  на URL http://localhost:3012/artist/33
  с телом
  {"a": 2020202}




# DEL-запрос, удаление item по его id.
app.put('/artist/:id', function (req, res) {
  updateOneId(req.params.id, function (result) {
    res.sendStatus(200);         //возвращаем подтверждение, что все прошло успешно. Обратно на фронт в теле ответа придет "OK".
  });
})

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





