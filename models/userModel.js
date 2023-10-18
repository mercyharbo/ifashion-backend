const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  address: String,
  profilePicture: String,
  phoneNumber: String,
  firstName: String,
  lastName: String,
  gender: String,
  dateOfBirth: Date,
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

module.exports = User
