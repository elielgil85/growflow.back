// routes/auth.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Regista um novo utilizador
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Autentica o utilizador e obtém o token
// @access  Public
router.post('/login', login);

module.exports = router;
