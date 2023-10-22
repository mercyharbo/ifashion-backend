// middleware/requireSellerAuthorization.js
function requireSellerAuthorization(req, res, next) {
  // Check if the user is authenticated and their account type is "seller"
  if (req.user && req.user.accountType === 'seller') {
    next() // User is authorized, continue to the route
  } else {
    res
      .status(403)
      .json({ message: 'Access denied. Seller authorization required.' })
  }
}

module.exports = requireSellerAuthorization
