const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ItemSchema = new Schema({
  image: { type: String, required: true },
  description: { type: String, required: true, max: 300 },
  order: { type: Number }
})

module.exports = mongoose.model('Item', ItemSchema)
