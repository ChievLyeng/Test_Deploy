const User = require('../models/UserModel')
const AppError = require('../utils/appError')
const asyncHandler = require('../utils/asyncHandler')

const getAlluser = asyncHandler(async (req, res, next) => {
    const users = await User.find()
    const result = await User.countDocuments()

    if (!users) {
        return next(new AppError('User not found!', 404))
    }

    res.status(200).json({
        status: 'Success',
        result,
        data: {
            users,
        },
    })
})

const updateMe = asyncHandler(async (req, res, next) => {
    //1. create error if user post password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please user /updateMyPassword.'
            ),
            400
        )
    }

    // prevent user on changing role
    if (req.body.role) {
        return next(new AppError('You are not allow to change role!', 400))
    }

    // 2. update user document
    const { email, ...updateFields } = req.body

    // Check if the user is attempting to change the email
    if (email && email !== req.user.email) {
        return next(new AppError('Email cannot be changed.', 400))
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateFields,
        {
            new: true,
            runvValidators: true,
        }
    )

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    })
})

const deleteMe = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null,
    })
})

module.exports = {
    getAlluser,
    updateMe,
    deleteMe,
}
