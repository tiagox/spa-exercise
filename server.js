require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const md5 = require('md5')
const { unlink } = require('fs')
const ItemModel = require('./models/item.schema')

mongoose.connect('mongodb://db/spa-exercise')

const app = express()

/**
 * Using `multer` middleware to handle file uploads.
 */
const upload = multer({
  storage: multer.diskStorage({
    destination: './images/',
    /**
     * I'm generating a standarized name just to fulfill my OCD.
     */
    filename: (req, file, cb) => {
      const extension = file.originalname.split('.').pop()
      cb(null, `${md5(Date.now())}.${extension}`)
    }
  })
})

app.use(express.json())
app.use(express.static('dist'))
app.use('/images', express.static('images'))

app.get('/items', (req, res) => {
  ItemModel.find({})
    .sort('order')
    .exec((_, items) => {
      res.send({ success: true, count: items.length, items })
    })
})

app.delete('/items/:id/delete', (req, res) => {
  ItemModel.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

app.put('/items/update-order', (req, res) => {
  const newOrder = req.body.map(Number)
  ItemModel.find({}, (_, items) => {
    items.forEach(item => {
      item.order = newOrder.indexOf(item.order)
      item.save()
    })
  })
  res.send({ success: true })
})

app.listen(process.env.APP_PORT, process.env.APP_HOST)

console.log(`Running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
