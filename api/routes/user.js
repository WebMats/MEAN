const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');


router.post('/signup', UserController.create_user)

router.post("/login", UserController.login_user)


module.exports = router;