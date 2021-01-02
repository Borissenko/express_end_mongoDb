var express = require('express');
var bodyParser = require('body-parser');

var app = express();    //экземпляр сервера
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    id: Date.now(),
    name: req.body.name
  }
  artists.push(artist);
  res.send(artist);
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


//входной порт сервера
app.listen(3012, function () {
  console.log('API app started')     //это сработает при запуске сервера. Надпись появиться в консоле
})

//запуск сервера -  node server.js,
//обращение к серверу из броузера -  http://localhost:3012, в броузере увидим 'Hello API'.






