## Подключение MongoDB.

#1) Устанавливаем MongoDB на ноутбук, глобально.
https://docs.mongodb.com/guides/server/install/
http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/

MongoDB имеет 2 разновидности: Community and Enterprise(предприятие).

Для личного пользования на Убунте установка описана здесь:
  https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

Далее запускаем mongodb-сервер. Пока он запущен, датабаза - существует.
Поэтому express и mongodb мы должны запускать параллельно в разных вкладках консоли,
сначало bd, затем express.

>mongod
или по туториалу:
>sudo systemctl start mongod


Дополнительные команды по запуску датабазы:
> sudo systemctl status mongod       //проверяем, запущена ли MongoDB.
> sudo systemctl stop mongod
> sudo systemctl restart mongod
> Ctrl+C          //Остановить mongodb-сервер(+/_)





#2) В ПРОЕКТЕ
#0. Устанавливаем В ПРОЕКТ спец драйвер - mongodb.
>npm install mongodb --save


#1. Подсоединяем проект к MongoDB, установленной на ноутбуке, via MongoClient.
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'myproject';
const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});  //{useNewUrlParser: true} нужен при insertDocuments().



#2. Описываем необходимые нам манипуляции с данными
http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/   //<==
http://mongodb.github.io/node-mongodb-native/3.4/tutorials/collations/

const insertDocuments = function (db, callback) {
  const collection = db.collection('documents');  // Get the documents collection

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

const initialInsertDocuments = function (db, callback) {
  const collection = db.collection('documents');  // Get the documents collection

  collection.insertMany(artists, function (err, result) {   // Insert some documents
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    
    console.log("result ==", result);
    callback(result);
  });
}

const findAllDocuments = function (db, callback) {
  const collection = db.collection('documents');// Get the documents collection

// Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    
    console.log("docs ==", docs);
    callback(docs);
  });
}

const findDocuments = function (artistMarker, callback) {
  const db = client.db(dbName);                   // Get the db.
  const collection = db.collection('documents');  // Get the documents collection.

  collection.find(artistMarker).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);    //callback() задекларирована вторым аргументом при вызове findDocuments(), что прописано в app.get('/artists/:id', ...).
  });
}

const findDocuments_0 = function (db, callback) {
  const collection = db.collection('documents');// Get the documents collection

  collection.find({a: 55}, {b: 33}).toArray(function (err, docs) {
    assert.equal(err, null);
    
    console.log("findDocuments) ==");
    callback(docs);
  });
}

//Добавление НОВОГО ПОЛЯ в ПЕРВЫЙ попавшийся item, у которого { a : 2 }, или ПЕРЕТЕРЕТЬ значение этого поля новым значением.
const updateDocument = function (db, callback) {
  const collection = db.collection('documents');// Get the documents collection

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
  const collection = db.collection('documents');// Get the documents collection

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


# assert.equal(err, null);
- это проверка на ошибку.
Специально чтобы упростить верификацию результатов в тестах для Node.js был создан специальный модуль - assert.
Функция assert.equal() сравнивает два значения. Если они не равны, то генерируется ошибка.

# Использование _id для фильтрации и поиска в db - не получается.






#3. Запускаем express-прослушивание после срабатывания у db его обработчика события client.connect.

client.connect(function (err) {
  assert.equal(null, err);
  console.log("MongoDb connected successfully to server");
  
  app.listen(3012, function () {        //запускаем прослушивание express'a.
    console.log('API app started')      //это сработает при запуске сервера. Надпись появиться в консоле.
  })

  const db = client.db(dbName);
  initialInsertDocuments(db, function() {      //грузим в MongoDb изачальные данные
    client.close();
  });
  
  
});



#4. Декларируем в express'e его роуты и добавляем в них команды запуска избранных функций MongoDb.

//Запрос на получения полных данных по определенному артисту- с именем "Kola".
//Запрос http://localhost:80/artists/Kola

app.get('/artists/:id', function (req, res) {    
  var artistMarker = {name: req.params.id};

  findDocuments(artistMarker, function (docs) {
    res.send(docs);
    client.close();
  });

  // insertDocuments(artist, function() {   //Вкладываем одну функцию в другую: сначала добавили и, как коллбэк, - нашли.
  //   findDocuments(artistMarker, function() {
  //     client.close();
  //   });
  // });

})





#5. Запускаем MongoDb и express в 2 разных терминалах.
>sudo systemctl start mongod    //из любого места
>node server.js                 //находясь рядом с server.js, где задекларирован express.


















