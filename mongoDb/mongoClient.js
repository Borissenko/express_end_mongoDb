const MongoClient = require('mongodb').MongoClient;

const dbName = 'myproject';
const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});

const mongoClient = client.db(dbName);

exports.get = function () {
  return mongoClient;
}



exports.connecting = function (url, done) {

};
 
 
 
 
 //использование
mongoClient.connecting('mongodb://localhost:27017/api', function (err, database) {
  assert.equal(null, err);
  console.log("= MongoDb connected to server successfully");
  
  initialInsertDocuments(initialArtists, function() {      //грузим в MongoDb изначальные данные.
    console.log('=initialInsertDocuments')
  });
  
  app.listen(3012, function () {
    console.log('=express listening started')
  })
})


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