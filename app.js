require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('./config/db')

app.use(express.json())

const authRoutes = require('./routes/authRoutes')
app.use('/user', authRoutes)

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})
