const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const User = require('../controllers/mondels/User');


router.post('/signup', UserController.create_user)

router.post("/login", UserController.login_user)


router.get("", (req, res, next) => {
	User.find().then(response => {
		res.status(200).json({Users: response})
	})
})

router.delete("/:id", (req, res, next) => {
	User.deleteOne({_id: req.params.id}).then(feedback => {
		res.status(202).json({message: feedback})
	}).catch(err => {
		res.status(400).json({error: err})
	})
})


module.exports = router;