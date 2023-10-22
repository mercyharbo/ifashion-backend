const express = require('express')
const router = express.Router()
const Product = require('../models/productModel')
const requireSellerAuthorization = require('../middleware/sellerAuthorization')
const verifyToken = require('../middleware/verifyToken')

// Create a new product
router.post(
  '/products',
  verifyToken,
  requireSellerAuthorization,
  async (req, res) => {
    try {
      const newProduct = new Product(req.body)
      const savedProduct = await newProduct.save()
      res.status(201).json({ success: true, savedProduct })
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: 'Error creating product', error: err })
    }
  }
)

// Get a list of all products
router.get('/products', verifyToken, async (req, res) => {
  try {
    const products = await Product.find()
    res.json({ success: true, products })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching products', error: err })
  }
})

// Get product details by ID
router.get('/products/:id', verifyToken, async (req, res) => {
  const productId = req.params.id
  try {
    const product = await Product.findById(productId)
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' })
    } else {
      res.json({ success: true, product })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product details',
      error: err,
    })
  }
})

// Update a product by ID
router.put(
  '/products/:id',
  verifyToken,
  requireSellerAuthorization,
  async (req, res) => {
    const productId = req.params.id
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      )
      if (!updatedProduct) {
        res.status(404).json({ success: false, message: 'Product not found' })
      } else {
        res.json({ success: true, updatedProduct })
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: 'Error updating product', error: err })
    }
  }
)

// Delete a product by ID
router.delete(
  '/products/:id',
  verifyToken,
  requireSellerAuthorization,
  async (req, res) => {
    const productId = req.params.id
    try {
      const deletedProduct = await Product.findByIdAndRemove(productId)
      if (!deletedProduct) {
        res.status(404).json({ success: false, message: 'Product not found' })
      } else {
        res.json({ success: true, message: 'Product deleted successfully' })
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: 'Error deleting product', error: err })
    }
  }
)

module.exports = router
