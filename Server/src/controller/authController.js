const crypto = require('crypto')
const { promisify } = require('util')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
const Token = require('../models/token')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const sendToken = (user, statusCode, res) => {
    const token = generateToken(user._id)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    })
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body

    const newUser = await User.create({
        userName: username,
        email,
        password,
        passwordConfirm,
        ...req.body,
    })

    const token = await new Token({
        userId: newUser._id,
        token: crypto.randomBytes(32).toString('hex'),
    }).save()

    const url = `${process.env.BASE_URL}/api/v1/users/${newUser._id}/verify/${token.token}`
    const message = `We're happy you signed up for our application. Pleas use this link
     ${url} or click the button to verify your account.`

    await sendEmail({
        email: newUser.email,
        subject: 'Please verify your email.',
        message,
        url,
    })
    // sendToken(newUser, 201, res)

    res.status(201).json({
        status: 'succes',
        message:
            'An email has been sent to your account. Please verify your email before logging in.',
        data: {
            newUser,
        },
    })
})

const verifyEmail = asyncHandler(async (req, res, nextur) => {
    const user = await User.findOne({ _id: req.params.id })

    if (!user) {
        return next(new AppError('Invalid Link!!!', 400))
    }

    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
    })

    if (!token) {
        return next(new AppError('Invalid Link!!!', 400))
    }

    const updateUser = await User.updateOne(
        { _id: user._id },
        { verified: true }
    )

    if (!updateUser) {
        return next(new AppError('Internal Server Error', 500))
    }

    if (updateUser) {
        res.redirect(
            `http://localhost:5173/users/${req.params.id}/verify/${req.params.token}`
        )
    }

    // delete token after verify
    await Token.findOneAndDelete({ userId: user._id })

    res.status(200).json({
        status: 'success',
        message: "User's email verify successfully.",
    })
})

const Login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    if (!user.verified) {
        return next(
            new AppError('Please verify your email before logging in.', 400)
        )
    }

    sendToken(user, 200, res)
})

const requireSignIn = asyncHandler(async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(
            new AppError(
                'Your are not logged In! Please Log In to get access.',
                401
            )
        )
    }

    // verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // check if the user that logged in still exist
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.'
            )
        )
    }

    // check if user change password after token was issued
    if (currentUser.ChangePasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please Log In again.',
                401
            )
        )
    }

    // grant access to protected route
    req.user = currentUser
    next()
})

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action.',
                    403
                )
            )
        }

        next()
    }
}

const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body

    if (!email) {
        return next(new AppError('Please enter you email!'))
    }

    // 1. get user based on posted email
    const user = await User.findOne({ email })
    if (!user) {
        return next(
            new AppError('There is no user with this email address.', 404)
        )
    }

    // 2. generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    // 3. send it to user's email
    const resetURL = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`

    const message = `Forgot your passowrd? Submit a reset request with your new password and 
    passwordConfirm to: ${resetURL}. \n If you didn't forget your passowrd,
    please ignor this email.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Forgot Password Verify Token',
            message,
            url: resetURL,
        })

        res.status(200).json({
            status: 'success',
            message: `Token sent to user's email!`,
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(
            new AppError(
                'There was an error sending the email. Try again later!'
            ),
            500
        )
    }
})

const resetPassword = asyncHandler(async (req, res, next) => {
    // 1. get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    // find user by hashed token and compare the expire date
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    // 2. If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired.', 400))
    }

    // reset password and delete and save
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetExpires = undefined
    user.passwordResetToken = undefined
    await user.save()

    // 3. update changedPassowordAt property for the user
    // 4. log the user in, send JWT

    sendToken(user, 200, res)
})

const updatePassword = asyncHandler(async (req, res, next) => {
    // const { id } = req.params.id
    // 1. get user from collection
    const user = await User.findById(req.user.id).select('+password')

    // 2. Check if posted current password is correct
    if (
        !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
        return next(new AppError('Your current password is wrong.', 401))
    }

    // 3 . If so, update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    // 4. Log user in, send JWT
    sendToken(user, 200, res)
})

module.exports = {
    registerUser,
    Login,
    requireSignIn,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    verifyEmail,
}
