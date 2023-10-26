const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const verifyToken = require('../middleware/verifyToken')
const { revokeToken } = require('../utils/tokenUtils')

// Signup route with password hashing
router.post('/signup', async (req, res) => {
  const {
    email,
    password,
    address,
    phoneNumber,
    firstName,
    lastName,
    gender,
    dateOfBirth,
    accountType,
  } = req.body

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' })
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      password: hashedPassword, // Save the hashed password
      address,
      profilePicture,
      phoneNumber,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      accountType,
    })

    await newUser.save()

    const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY)
    res.json({ success: true, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Login route with console logging
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' })
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' })
    }

    // Create and send a JWT token
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY)
    res.json({ success: true, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Profile retrieval route with authentication
router.get('/profile', verifyToken, async (req, res) => {
  // The user's email is available from the verified token
  const { email } = req.user

  try {
    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Exclude sensitive information like the hashed password before sending the user's profile
    const userProfile = {
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      accountType: user.accountType,
    }

    res.json({ success: true, profile: userProfile })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Update the user's profile (multiple fields)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      address,
      phoneNumber,
      gender,
      dateOfBirth,
      accountType,
    } = req.body
    const user = req.user

    // Update the fields as needed
    user.email = email
    user.firstName = firstName
    user.lastName = lastName
    user.address = address
    user.phoneNumber = phoneNumber
    user.gender = gender
    user.dateOfBirth = dateOfBirth
    user.accountType = accountType

    await user.save()

    res.json({ success: true, message: 'Profile updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Logout route
router.post('/logout', verifyToken, async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: 'Token not provided or invalid' })
  }

  // Extract the token from the user object if needed
  const token = req.headers.authorization.split(' ')[1]

  // Invalidate the token by adding it to the revoked tokens list
  revokeToken(token, 'user logout')

  // Respond with a success message
  res.json({ success: true, message: 'Logged out successfully' })
})

// Change password route
router.put('/change-password', verifyToken, async (req, res) => {
  // The user's email is available from the verified token
  const { email } = req.user
  const { oldPassword, newPassword } = req.body

  try {
    // Find the user by email (available from the token)
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Compare the provided old password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid old password' })
    }

    // Hash the new password before saving it to the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password
    user.password = hashedNewPassword

    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})



module.exports = router
