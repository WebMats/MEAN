const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt =require('bcrypt');
const User = require('../controllers/mondels/User');




router.post('/signup', (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then(hash => {
		const user = new User({
			email: req.body.email,
			password: hash
		});
		user.save().then(result => {
			res.status(201).json({message: "user created!", result: result})
		}).catch(err => {
			res.staus(500).json({error: err})
		})
	})
})




module.exports = router;