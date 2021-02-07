//https://abskmj.github.io/notes/posts/express/express-multer-mongoose-gridfile/
//https://gist.github.com/abskmj/655dbc3191e108d6a5a55e28446bc1e9

// Install Dependencies
// - express to create the APIs
// - multer - парсит multipart/form-data, что мы получаем через req.files
// - mongoose to manage connections to MongoDB
// - gridfile to manage interactions with GridFS



//1. Создаем grid-схему
const mongoose = require('mongoose')
const schema = require('gridfile')

module.exports = mongoose.model('GridFile', schema)


//2. Получение файла от пользователя.
const multer = require('multer')   // - парсит multipart/form-data, результат мы получаем через req.files
const upload = multer({ dest: path.join(__dirname, '.') })

app.post('/v1/files', upload.any(), async (req, res, nxt) => {
  try {
    // uploaded file are accessible as req.files
    if (req.files) {
      const promises = req.files.map(async (file) => {
        const fileStream = fs.createReadStream(file.path)
        
        // upload file to gridfs
        const gridFile = new GridFile({ filename: file.originalname })
        await gridFile.upload(fileStream)
        
        // delete the file from local folder
        fs.unlinkSync(file.path)
      })
      
      await Promise.all(promises)
    }
    
    res.sendStatus(201)
  } catch (err) {
    nxt(err)
  }
})




//3. Подтверждаем, что посланные файлы созранены в GridFile
app.get('/v1/files', async (req, res, nxt) => {
  try {
    const files = await GridFile.find({})
    
    res.json(files)
  } catch (err) {
    nxt(err)
  }
})

// Sample response
//   [
//   {
//     "aliases": [],
//     "_id": "5f6850023516552ad21d0007",
//     "length": 7945,
//     "chunkSize": 261120,
//     "uploadDate": "2020-09-21T07:02:26.389Z",
//     "filename": "attachment.pdf",
//     "md5": "fa7d7e650b2cec68f302b31ba28235d8"
//   }
//   ]



// 4. Download File API
// API returns the file from the GridFS using its id.

app.get('/v1/files/:id/:name', async (req, res, nxt) => {
  try {
    const { id, name } = req.params
    
    const gridFile = await GridFile.findById(id)
    
    if (gridFile) {
      res.attachment(name)
      gridFile.downloadStream(res)
    } else {
      // file not found
      res.status(404).json({ error: 'file not found' })
    }
  } catch (err) {
    nxt(err)
  }
})

// Sample Request URL:
// /v1/files/5f6850023516552ad21d0007/attachment.pdf










