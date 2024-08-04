const express = require('express');
const { login, logout } = require('../controllers/Auth.js');

const router = express.Router();

//Rute Post
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
