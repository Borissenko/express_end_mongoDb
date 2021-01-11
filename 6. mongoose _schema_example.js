
var KittenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,  //id схемы. Это поле прописывать в схеме нет нужды.
  name: {
    firstName: {
      type: String,
      required: true   // будет ошибка, если не укажем
    }
  },
  created: {
    type: Date,
    default: Date.now  //default значение
  },
  created_2: {
    type: [{
      uploaded: {
        type: Date,
        default: Date.now
      },
      src: String
    }],
    // значение по-умолчанию для поля images
    default: [{uploaded: new Date(2012, 11, 22), src: '/img/default.png'}]
  },
  facebook: {
    type: String,
    validate: {       //валидция при сохранении в db.
      validator: function(text) {
        return text.indexOf('https://www.facebook.com/') === 0;  //в начале строчки д.б. сегмент 'https://www.facebook.com/'.
      },
      message: 'Facebook must start with https://www.facebook.com/'
    }
  },
  profilePicture: Buffer,  //картинка
  ratings: [    //декларация массива однотипных {}.
    {
      stars: Number
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,   //ВЛОЖЕНИЕ другой СХЕМЫ. Здесь будет _id второй схемы.
    ref: 'owner' //зачем?
  },
});



//создаем модель на основе схемы
const KittenModel = mongoose.model('Kitten', kittySchema);

//создаем документ как экземпляр модели
let KittenInstance = new KittenModel({
  _id: 25, //_id добавляется автоматически, но мы его можем здесь переопределить.
  name: 'Silence',
  biography: 'Jamie is the author of ASP.NET MVC 5 with Bootstrap and Knockout.js.',
  twitter: 'https://twitter.com/endyourif',
});

KittenInstance._id instanceof mongoose.Types.ObjectId; // true.  _id добавлено автоматически.


//экспортируем модель наружу
module.exports = KittenModel;

//импортируем модель
var KittenModel = require('./schemas_models');













