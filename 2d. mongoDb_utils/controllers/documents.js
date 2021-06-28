//На сервере используем mongodb, а не mongoose.
//Здесь описаны функции, которые далее будут вызываться роутами express.
//Имя файла - по имени коллекции в базе данных.
var docModels = require('../models/documents')

exports.findAllDocuments = function (req, res) {   //это выведется в броузере при http://localhost:3012
  docModels.findAllDocuments(null, function (docs) {
    res.send(docs);
  })
}

exports.findDocuments = function (req, res) {    //получение отфильтрованных членов, которые имеют поле {name: req.params.id}.
  var artistMarker = {name: req.params.id};
  docModels.findDocuments(artistMarker, function (docs) {
    res.send(docs);
  });
}

exports.findOne = function (req, RES) {    //получение данных по члену с конкретным id.
  let id = req.params.id;
  docModels.findOne(id, function (doc) {
    RES.send(doc);
  });
}

exports.updateDocument = function (req, res) {
  docModels.updateDocument(req.body, function (docs) {
    res.send(docs);  //или res.sendStatus(200)
  });
}

exports.updateOneId = function (req, res) {  //обновление поля у конкретного по id члена.
  let dd = [req.params.id, req.body]
  docModels.updateOneId(dd, function (result) {
    res.sendStatus(200);         //возвращаем подтверждение, что все прошло успешно. Обратно на фронт в теле ответа придет "OK".
  });
}







