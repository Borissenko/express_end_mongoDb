# express-session
//https://github.com/expressjs/session
- библиотека, помогающая генерировать сессии.
- использует cookie-parser для разбора файлов cookie.

Смысл отмечать сессию - данные клиента хранятся на сервере, а 
идентификатор сессии хранится на клиенте в cookie. 

# Установка session
npm install express-session
npm install body-parser        // ДОЛЖЕН БЫТЬ(!), для обработки данных, передаваемых в теле запроса.

# Декларация session
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(session)   //npm i connect-mongo  //Сохранение сессии в mongoStorage. См. ниже.

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  name: 'name_of_the_session_ID_cookie',   // (ДОПОЛНИТЕЛЬНОЕ) имя сессии, а по-умолчанию - "connect.sid".
  secret: 'secretWord',          // секретное слово для шифрования
  key: 'cookieName',             // имя куки  ?
  cookie: {
    path: '/',          // где действует
    httpOnly: true,     // По-умолчанию - true, чтобы куку не могли читать на клиенте.
    maxAge: 900000      // время жизни сессионной куки
  },
  saveUninitialized: false,   // on default. Forces a session that is "uninitialized" to be saved to the store.
  resave: false,               // on  default
  store: new MongoStore({ mongooseConnection: mongoose.connection }  //Сохранение сессии в mongoStorage. См. ниже.
}));



app.all('/', function (req, res, next) { 
  console.log(req.session.id);    // получаем id

  // в сессию мы можем проставлять КАСТОМНЫЕ ПЕРЕМЕННЫЕ  //здесь- счетчик посещения
  req.session.views = req.session.views === void 0 ? 0 : req.session.views
  req.session.views++
  next()
})


опции:                         //https://github.com/expressjs/session
name: 'name_of_the_session_ID_cookie' - имя сессии, по-умолчанию - "connect.sid".
cookie - настройка cookie хранения идентификатора сессии, передается объект с опциями;
genid - функция, которая возвращает новый идентификатор сессии в виде строки (по умолчанию используется функция, генерирующая идентификаторы на основе библиотеки uid-safe);
resave - булевое значение, указывает, нужно ли пересохранять сессию в хранилище, если она не изменилась (по умолчанию false);
rolling - булевое значение, указывающее, нужно ли устанавливать идентификатор сессии cookie на каждый запрос (по умолчанию false);
saveUninitialized - булевое значение, если true, то в хранилище будут попадать пустые сессии;
secret - строка, которой подписывается сохраняемый в cookie идентификатор сессии;
store - экземпляр хранилища, которое будет использоваться для хранения сессии (см. ниже).




# (!) Сессия считается пустой, И т.о. НЕ БУДЕТ генерироваться сессионная кука, 
если в конце обработки запроса в нее не было записано никаких данных.
Нр:
req.session.showAd = {name: 'kola', use: 'Ola'}   //и это ДОЛЖНО БЫТЬ тоже, наравне с res.send(data)
res.send(data)

или совершать при первом (каждом) запросе
if(!req.session.i) 
  req.session.i = 0;
++req.session.i;



## Запись информации в КАСТОМНУЮ ПЕРЕМЕННУЮ сессии
- ею может быть примитив или объект.

app.post('/add', (req, res) => {    //Пользователь дает на что-то свое согласие, и это записывается ему в куку.
  req.session.showAd = req.body.showAdd    // req.body.showAd ="agree".  Задали значение для переменной сесии showAd.
  res.sendStatus(200)
})

## Получение информации из КАСТОМНЫХ ПЕРЕМЕННЫХ сессии
app.get('/getsession', (req, res) => {
  console.log(req.session.showAdd)          // =считали обратно
  res.sendStatus(200)
})

## получение куков из хедера запроса
req.headers.cookie


##  Удаление КАСТОМНОЙ ПЕРЕМЕННОЙ сессии, logout.
delete req.session.user;


## Поля req.session
req.session.id    //это другое, чем "connect.sid".
req.sessionID     //то же, что и req.session.id
req.session.cookie    //возвращает параметры для куки, а не ее значение.
req.session.cookie.maxAge = 3600000
req.session.showAdd    //получение кастомной переменной



## Получить значение сессии "connect.sid"
req.headers.cookie     //можно ТОЛЬКО(?) так.

But для идентификации сессии используем req.sessionID, а не connect.sid ?


## Как connect.sid генерируется:
var connectsid = 's.'+req.sessionID+'.'+crypto.createHmac('sha256', secret)
.update(req.sessionID).digest('base64').replace(/\=+$/, '');





# Восстановление сессии
req.session.regenerate(callback)
  //We call this to regenerate the session. Once it’s called, a new session ID and Session instance will be initialized at req.session and the callback will be called.

# Удаление сессии
if (req.session) {
  req.session.destroy(function() {});
}
res.redirect('/sessions/new');






# Сохранение сессии в mongoStorage via connect-mongo.
//https://www.npmjs.com/package/connect-mongo (см.!)
- должен быть уже подключен mongoose, т.к. используем его connection.

const mongoose = require("mongoose")   //ДОЛЖЕН БЫТЬ(!) Запрашивается при обращении к mongoose.connection.
const MongoStore = require('connect-mongo')(session)     //npm i connect-mongo

app.use(session({
  store: new MongoStore({     //Сохранение сессии в mongoStorage.
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60        // = 14 days - Default.   Переопределяем время жизни session cookie.
} 
  store: new MongoStore({ mongooseConnection: mongoose.connection[0] }  //Используем уже существующий коннект. Не работает.
}));





session cookie ГЕНЕРИРУЕТСЯ в броузере клиента при получении первого же ответа на какой-либо запрос, 
генерируется командой Set-Cookie из хедера ответа, причем сессия не д.б. "пустой" (см выше).

СЧИТАТЬ session cookie можно из последующих запросов в хедере запроса - там номер сессии будет положено в поле куков каждого последующго запроса от клиента.

ИМЯ session cookie - по-умолчанию "connect.sid", 
или то, что задали в

app.use(session({
 name:  'name_of_the_session_ID_cookie'  //по-умолчанию значение имени сессионной куки- "connect.sid"
}))





Пример из //https://www.npmjs.com/package/:

app.use(express.session({
  secret: 'a4f8071f-c873-4447-8ee2',
  cookie: { maxAge: 2628000000 },
  store: new (require('express-sessions'))({
    storage: 'mongodb',
    instance: mongoose, // optional
    host: 'localhost', // optional
    port: 27017, // optional
    db: 'test', // optional
    collection: 'sessions', // optional
    expire: 86400 // optional
  })
}));




# Сохранение сессии в redis
//https://www.npmjs.com/package/express-sessions  - не проверял
//https://xsltdev.ru/nodejs/tutorial/sessions/  - не работает

var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

app.use(express.session({
  secret: 'a4f8071f-c873-4447-8ee2',
  cookie: { maxAge: 2628000000 },
  store: new (require('express-sessions'))({
    storage: 'redis',
    instance: client, // optional
    host: 'localhost', // optional
    port: 6379, // optional
    collection: 'sessions', // optional
    expire: 86400 // optional
  })
}));




# Интересные статьи
https://www.js-tutorials.com/nodejs-tutorial/nodejs-session-example-using-express-session/     <=
https://developpaper.com/brief-introduction-of-express-using-mongodb-to-manage-session-storage-connect-mongo-module/

## Архитектура проекта
https://nodeguide.ru/doc/dailyjs-nodepad/node-tutorial-5/
https://teamtreehouse.com/community/using-mongodb-as-a-session-store

