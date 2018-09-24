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

app.post('/items', upload.single('image'), (req, res) => {
  // I need to fetch the last element in the ordered list of items.
  // All the new items will be added at the end of it.
  ItemModel.find({})
    .sort({ order: -1 })
    .limit(1)
    .exec((_, [lastItem]) => {
      // Once I have the last item, I'll be able to set all
      // the data in the model and then save.
      const newItem = new ItemModel({
        image: req.file.path,
        description: req.body.description,
        order: lastItem.order + 1
      })
      newItem.save((err, item) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send({ success: true, item })
        }
      })
    })
})

app.put('/items/:id', upload.single('image'), (req, res) => {
  ItemModel.findById(req.params.id, (_, item) => {
    console.log(item)
    item.description = req.body.description
    if (req.file) {
      // I won't care much about a possible error in the
      // deletion of an existing file, by now.
      unlink(item.image, () => {})
      item.image = req.file.path
    }
    item.save((err, item) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send({ success: true, item })
      }
    })
  })
})

app.delete('/items/:id', (req, res) => {
  ItemModel.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send({ success: true })
    }
  })
})

app.put('/items/order/update', upload.none(), (req, res) => {
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
