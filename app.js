require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('./config/db')

const PORT = process.env.PORT || 8080

app.use(express.json())

const authRoutes = require('./routes/authRoutes')
app.use('/user', authRoutes)

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:8080')
})
