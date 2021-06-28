// Как лучше организовать модель корзины в mongodb
//https://ru.stackoverflow.com/questions/1069896/%D0%9A%D0%B0%D0%BA-%D0%BB%D1%83%D1%87%D1%88%D0%B5-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C-%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C-%D0%BA%D0%BE%D1%80%D0%B7%D0%B8%D0%BD%D1%8B-%D0%B2-mongodb

// Предположим, что у вас следующие сущности:
  
  Card:
    _id: objectId
products: Array(ObjectId[product])



Product:
  _id: objectId
name: string
description: string
price: number

// Тогда вот запрос для получения информации из корзины, включая продукты:
  
  db.getCollection('card').aggregate([{
    $lookup:
      {
        from: "product",
        localField: "products",
        foreignField: "_id",
        as: "products"
      }
  }]);


// PS. В mongoose, к примеру, все тоже самое можно сделать через populate

