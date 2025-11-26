const express = require('express');
const router = express.Router();
const { createProfile, getMyProfile, getAllUsers, setRole, forgotPassword, resetPassword } = require('../src/controller/auth.controller');

router.post('/profile', createProfile);

router.get('/profile', getMyProfile);

router.get('/users', getAllUsers);

router.put('/role', setRole);

// Password reset endpoints
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
