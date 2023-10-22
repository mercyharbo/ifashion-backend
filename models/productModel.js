const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  productImage: String,
  title: String,
  reviews: [
    {
      id: Number,
      user: String,
      rating: Number,
      comment: String,
      createdDate: { type: Date, default: Date.now },
    },
  ],
  price: Number,
  discount: Number,
  category: String,
  colors: [String],
  available_sizes: [String],
  createdDate: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Product', productSchema)
