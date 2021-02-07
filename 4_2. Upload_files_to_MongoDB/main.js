//https://dev.to/fakorededamilola/uploading-images-on-mongodb-via-nodejs-5h1l


// Express : basically a Node.js web application framework
// Mongoose : Object Data Modeling (ODM) library for MongoDB and Node.js. It basically handles relationship between data
// Multer : Is used for uploading files
// Gridfs-stream : Allows streaming of files to and from mongodb
// Gridfs : This is a specification for storing and retriviing files that excess the BSON-document size limit of 16MB

// stored collection will be divided into two, imageUpload.chunk and imageUpload.files


// npm i express mongoose multer multer-gridfs-storage gridfs-stream


const express = require('express')
const path = require('path')
const crypto = require('crypto')//to generate file name
const mongoose = require('mongoose')
const multer = require('multer')                          // <== важен
const GridFsStorage = require('multer-gridfs-storage')    // <== важен
const Grid = require('gridfs-stream')

// const PORT =5000
const mongoURI = "mongodb://api_db:27017/api"

const app = express()

//mongoose.connect(MONGO_URL, {useNewUrlParser: true}) - здесь НЕТ!
let conn = mongoose.connection

let gfs           //ЭТО собственно db ???
conn.once('open', () => {
  //initialize our stream
  gfs = Grid(conn.db, mongoose.mongo)    //??
  gfs.collection('imageUpload')
})



//cleave
let storage = new GridFsStorage({
  url: uri,                               //здесь дб URL at mongoDb
  file: (req, file) => {
    return new Promise(
      (resolve, reject) => {
        const fileInfo = {
          filename: file.originalname,
          bucketName: "imageUpload"
        }
        resolve(fileInfo)
      }
    )
  }
})

const upload = multer({ storage })




app.post("/upload",upload.single("upload"),(req,res)=>{
  res.json({file:req.file})
})


app.listen(5000,()=>console.log(`Server started on port 5000`))








