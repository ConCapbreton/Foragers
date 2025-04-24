const express = require('express')
const { signup, verifyEmail, login, logout, forgotPassword, resetPassword, refresh, isAuthenticated, googleOauth, completeProfile } = require('../controllers/authController')
//const { verifyToken } = require('../middleware/verifyToken')

const router = express.Router()

router.get('/authenticated', isAuthenticated)
router.get('/refresh', refresh)

router.post('/signup', signup)
router.post('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

router.get('/google-oauth', googleOauth)
router.post('/complete-profile', completeProfile)

module.exports = router