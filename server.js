require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const ItemModel = require('./models/item.schema')

mongoose.connect('mongodb://db/spa-exercise')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use('/images', express.static('images'))

app.get('/items', (req, res) => {
  ItemModel.find({})
    .sort('order')
    .exec((_, items) => {
      res.send(items)
    })
})

app.listen(process.env.APP_PORT, process.env.APP_HOST)

console.log(`Running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
