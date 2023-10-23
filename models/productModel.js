const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  productImage: String,
  title: String,
  description: String,
  price: Number,
  discount: Number,
  category: String,
  colors: [String],
  images: [String],
  available_sizes: [String],
  reviews: [
    {
      id: Number,
      user: String,
      rating: Number,
      comment: String,
      createdDate: { type: Date, default: Date.now },
    },
  ],
  faq: [
    {
      question: String,
      answer: String,
      createdDate: { type: Date, default: Date.now },
    },
  ],
  related: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  createdDate: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Product', productSchema)
