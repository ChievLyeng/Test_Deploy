const dotenve = require('dotenv')
const app = require('./app')
const connectDB = require('./src/config/DB')
require('dotenv').config()

// connect DB
connectDB()

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!!!`)
})
