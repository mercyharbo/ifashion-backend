// routes/sellerRoutes.js
const express = require('express')
const router = express.Router()
const requireSellerAuthorization = require('../middleware/sellerAuthorization')

// Protected route for sellers
router.get('/seller-protected', requireSellerAuthorization, (req, res) => {
  // This route is protected and only accessible to sellers
  // req.user should be available here, and you've already checked for seller authorization
  res.json({ message: 'This is a protected seller route.' })
})

module.exports = router
