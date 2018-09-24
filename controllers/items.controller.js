const { unlink } = require('fs')
const ItemModel = require('../models/item.schema')

exports.listItems = (req, res) => {
  ItemModel.find({})
    .sort('order')
    .exec((_, items) => {
      res.send({ success: true, count: items.length, items })
    })
}

exports.createItem = (req, res) => {
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
}

exports.updateItem = (req, res) => {
  ItemModel.findById(req.params.id, (_, item) => {
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
}

exports.deleteItem = (req, res) => {
  ItemModel.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send({ success: true })
    }
  })
}

exports.updateOrder = (req, res) => {
  const newOrder = req.body.map(Number)
  ItemModel.find({}, (_, items) => {
    items.forEach(item => {
      item.order = newOrder.indexOf(item.order)
      item.save()
    })
  })
  res.send({ success: true })
}
