const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  address: String,
  phoneNumber: String,
  firstName: String,
  lastName: String,
  gender: String,
  dateOfBirth: Date,
  accountType: {
    type: String,
    enum: ['buyer', 'seller'], // Add seller as a possible account type
    default: 'buyer', // Set a default account type
  },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema)

module.exports = User
