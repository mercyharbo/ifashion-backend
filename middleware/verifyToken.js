const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: 'Failed to authenticate token' })
      }

      try {
        // If the token is valid, find the user based on the decoded email
        const user = await User.findOne({ email: decoded.email }).exec()

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: 'User not found' })
        }

        // Attach the user object to the request for further route processing
        req.user = user
        next()
      } catch (err) {
        return res.status(500).json({ success: false, message: err })
      }
    })
  } else {
    req.user = undefined
    next()
  }
}

module.exports = verifyToken
