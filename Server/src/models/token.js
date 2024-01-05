const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
        unique: true,
    },
    token: {
        type: String,
        required: [true, 'Token is require'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600, // expire in 1 hour
    },
})

module.exports = mongoose.model('token',tokenSchema)
