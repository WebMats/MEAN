const mongoose = require('mongoose')
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('./mondels/User');



exports.login_user = (req, res, next) => {
	let fetchedUser;
	User.findOne({email: req.body.email}).then(user => {
		fetchedUser = user;
		if (!user) {
			return res.status(401).json({message: "Invalid authentication credentials"})
		}
		return bcrypt.compare(req.body.password, user.password)
	}).then(result => {
		if (!result) {
			res.status(401).json({message: "Invalid authentication credentials"})
		}
		 const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: '2h'})
		 res.status(200).json({id: fetchedUser._id, token: token, expiresIn: 7200})
	}).catch(err => {
		res.status(500).json({message: "Authentication failed, please try again!"})
	})
}


exports.create_user = (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then(hash => {
		const user = new User({
			_id: mongoose.Types.ObjectId(),
			email: req.body.email,
			password: hash
		});
		user.save().then(createdUser => {
			if (!createdUser) {
				res.status(401).json({message: "Could not create user!"})
			}
			const token = jwt.sign({email: createdUser.email, userId: createdUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: '2h'})
			if (!token) {
				res.status(500).json({message: "Please try to sign in!"})
			}
			res.status(201).json({id: createdUser._id, token: token, expiresIn: 7200})
		}).catch(err => {
			res.status(500).json({message: "Email already in use!"})
		})
	})
}

