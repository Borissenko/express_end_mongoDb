//Как формировать коннект.
// What if we want to make another connections?
// Or if we want to connect to another database?

//1.
const mongoose = require('mongoose');

//2a. right way via mongoose.createConnection()
//Multiple connections
var connection = mongoose.createConnection('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
var MyModel = connection.model('Test', new Schema({ name: String }));

module.exports = MyModel;


//или
module.exports = function connectionFactory() {
  const connPlusModels = mongoose.createConnection(process.env.MONGODB_URI, { poolSize: 10 });  //poolSize - макс кол-во коннектов, по-умолчанию - 5.
  
  connPlusModels.model('User', require('../schemas/user'));      //Models are always(!) scoped to a single connection.
  connPlusModels.model('PageView', require('../schemas/pageView'));
  
  return connPlusModels;
};



//2b. For only one connect via mongoose.connect(), by default way.
//We can't use mongoose.connect() again
mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
var MyModel = mongoose.model('Test', new Schema({ name: String }));



//3.
MyModel.findOne(function(error, result) { /* ... */ });



//https://mongoosejs.com/docs/connections.html
//https://dev.to/maixuanhan/stop-using-the-mongoose-s-default-connection-4nnj

