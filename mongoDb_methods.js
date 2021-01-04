
//1.
assert.equal(err, null);
assert.equal(3, result.result.n);
assert.equal(3, result.ops.length);  //collection.insertMany([{a: 1}, {a: 2}, {a: 3}], ...), result.ops.length = [{a: 1}, {a: 2}, {a: 3}].length
// - это проверка на ошибку.
//   Специально чтобы упростить верификацию результатов в тестах для Node.js был создан специальный модуль - assert.
//   Функция assert.equal() сравнивает два значения. Если они не равны, то генерируется ошибка.

//Вместо assert.equal(err, null) ошибку можно обрабатывать по-старому:
if (err) {
  console.log(err);
  return res.sendStatus(500);   //важно написать return, что бы код не шел дальше.
}




//2.
// Использование _id для фильтрации и поиска в db - не получается.

//3.
client.close();     //прекращение работы клиента. Разумно запускать только при остановке express.

//4.
// Выборка с сортировкой по полю(по возрастанию - 1, по убыванию - -1):
db.peoples.find().sort({name: 1})     //use sort только после find() (!).


//
// Выборка с условными операторами:
//   $eq - =
//   $gt - >
//   $lt - <
//   $gte - >=
//   $lte - <=
//   $ne - <>
//
// Пример с двумя условиями больше и меньше указанных значений:
// db.peoples.find({"address.index": {$gt : 111500, $lt : 111700}})






//статья с выборкой команд
//http://snakeproject.ru/rubric/article.php?art=mongodb_manual




