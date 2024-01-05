const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, 'Username is require.'],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is require.'],
            validate: [validator.isEmail, 'Please provide a valid email'],
            trim: true,
        },
        birthDate: {
            type: Date,
            // required: [true, 'Birthdate is required.'],
        },
        gender: {
            type: String,
            enum: {
                values: ['Male', 'Female', 'Other'],
                message: 'Gender can only have Male, Female, Other',
            },
            // required: [true, 'Gender is required.'],
        },
        phoneNumber: {
            type: Number,
        },
        profile: String,
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'User type either user, admin',
            },
            default: 'user',
        },
        verified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        lastLogin: {
            type: String,
            default: new Date().toLocaleString(),
        },
        password: {
            type: String,
            required: [true, 'Password is require.'],
            validate: [
                validator.isStrongPassword,
                'Password must contain character, number and symbol.',
            ],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                // This only works on CREATE and SAVE!!!
                validator: function (el) {
                    return el === this.password
                },
                message: 'Passwords are not the same!',
            },
        },
        passwordChangeAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
        address: {
            city: {
                type: String,
                trim: true,
            },
            commune: {
                type: String,
                trim: true,
            },
            district: {
                type: String,
                trim: true,
            },
            village: {
                type: String,
                trim: true,
            },
            homeNumber: {
                type: Number,
                trim: true,
            },
            street: {
                type: String,
                trim: true,
            },
        },
    },
    {
        timestamps: true,
    }
)
// middleware  for ecnrypt password before save
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next() // check if user not input password

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete passwordConfirm field
    this.passwordConfirm = undefined
    next()
})

// save changePasswordAt before save
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangeAt = Date.now() - 1000 // put it at past of 1 second
    next()
})

// middleware for compare password
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

// compare if the token generate befor or after password change
userSchema.methods.ChangePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        // divide with 1000 cause passwordChangeAt is miliseconds
        const changeTimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        )

        return JWTTimestamp < changeTimestamp
    }

    // false mean not change
    return false
}

// create reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    console.log({ resetToken }, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

// query only active user middleware
userSchema.pre(/^find/, function (next) {
    // this point to current query
    this.find({ active: { $ne: false } })

    next();
})

const User = mongoose.model('User', userSchema)
module.exports = User
