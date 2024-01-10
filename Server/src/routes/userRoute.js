const express = require('express')
const {
    registerUser,
    Login,
    requireSignIn,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    verifyEmail,
} = require('../controller/authController')
const {
    getAlluser,
    updateMe,
    deleteMe,
} = require('../controller/userController')
const router = express.Router()

//auth route
router.post('/register', registerUser)
router.post('/login', Login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updateMyPassword', requireSignIn, updatePassword)
router.patch('/updateMe', requireSignIn, updateMe)
router.delete('/deleteMe', requireSignIn, deleteMe)
router.get('/:id/verify/:token', verifyEmail)
router.get("/test", (request, response) => {
    return response.send(`
        <br />
        <br />
        <center>
            <h1>
                Hello 👋 from AWS EC2
            </h1>
        </center>
    `);
});

// user route
router.route('/').get(requireSignIn, getAlluser)

module.exports = router
