const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')    //тестовый MongoDB In-Memory Server

const GridFile = require('./gridfile.model')
const upload = multer({ dest: path.join(__dirname, '.') })

const app = express()
const port = 3000

// upload a file
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

// list all uploaded files
app.get('/v1/files', async (req, res, nxt) => {
  try {
    const files = await GridFile.find({})

    res.json(files)

    /* sample response
      [
        {
          "aliases": [],
          "_id": "5f6850023516552ad21d0007",
          "length": 7945,
          "chunkSize": 261120,
          "uploadDate": "2020-09-21T07:02:26.389Z",
          "filename": "attachment.pdf",
          "md5": "fa7d7e650b2cec68f302b31ba28235d8"
        }
      ]
    */
  } catch (err) {
    nxt(err)
  }
})

// download a file
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

app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}`)

  // setup mongo in-memory database
  // const mongodb = new MongoMemoryServer()
  // const connectionUri = await mongodb.getUri()
  const connectionUri = "mongodb://api_db:27017/api"   //для меня
  
  await mongoose.connect(                       //ПОДКЛЮЧЕНИЕ К mongoDb
    connectionUri, { useNewUrlParser: true, useUnifiedTopology: true }
  )
})
