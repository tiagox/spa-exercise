require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const itemsRoutes = require('./routes/items.routes')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use('/images', express.static('images'))
app.use('/items', itemsRoutes)

app.listen(process.env.APP_PORT, process.env.APP_HOST)

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)

console.log(`Running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
