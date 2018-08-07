const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Post = require('../controllers/mondels/Post');
const checkAuth = require('../middleware/check-auth');


const multer = require('multer');
const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg'
};
const storageStructure = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("Invalid Mime Type!");
		if (isValid) {
			error = null;
		}
		cb(error, './api/images/');
	}, filename: (req, file, cb) => {
		const name = file.originalname.toLowerCase().split(' ').join('-');
		const ext = MIME_TYPE_MAP[file.mimetype];
		cb(null, `${name}-${new Date().toISOString()}.${ext}`)
	}
});
const upload = multer({storage: storageStructure, limit: {
	fileSize: 1024 * 1024 * 5,
	}
});



router.post('', checkAuth, upload.single('image'), (req,res,next) => {
	const url = `${req.protocol}://${req.get("host")}`
	req.body._id = mongoose.Types.ObjectId();
	const imagePath = `${url}/images/${req.file.filename}`;
	const post = new Post({...req.body, imagePath: imagePath, creator: req.userData.userId })
	console.log(post)
	post.save().then(createdPost => {
		res.status(201).json({message: "Post added succesfully!", post: createdPost})
	}).catch(err => {
		res.status(500).json({message: "Creating post failed!"})
	})
})

router.get('', (req, res, next) => {
	const pageSize = +req.query.pagesize;
	const currentPage = +req.query.page;
	const postQuery = Post.find();
	let fetchedPosts;
	if (pageSize && currentPage) {
		postQuery.skip(pageSize * (currentPage - 1))
		.limit(pageSize);
	}
	postQuery.find().then(posts => {
		fetchedPosts = posts
		return Post.countDocuments()
	}).then(count => {
		res.status(200).json({ message: "posts were fetched succesfully!", posts: fetchedPosts, maxPosts: count })
	}).catch(err => {
		res.status(500).json({message: "Fetching Posts Failed!"})
	})
	
})

router.get('/:id', (req, res, next) => {
	Post.findById({_id: req.params.id}).then(post => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({message: "Post not found!"})
		}
	}).catch(err => {
		res.status(500).json({message: "Fetching Post Failed!"})
	})
})

router.patch('/:id', checkAuth, upload.single('image'), (req, res, next) => {
	if (req.file) {
		const url = `${req.protocol}://${req.get("host")}`
		let imagePath = `${url}/images/${req.file.filename}`;
		req.body.imagePath = imagePath;
		req.body.creator = req.userData.userId
	}
	Post.updateOne({_id: req.params.id, creator: req.userData.userId}, req.body).then(result => {
		if (result.nModified > 0) {
			res.status(200).json({message: "update succesful!"})	
		} else {
			res.status(401).json({message: "Not Authorized!"})
		}
	}).catch(err => {
		res.status(500).json({message: "Could not update post!"})
	})
})

router.delete('/:id', checkAuth, (req, res, next) => {
	Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
		if (result.n > 0) {
			res.status(200).json({message: "Deletion succesful!"})	
		} else {
			res.status(401).json({message: "Not Authorized!"})
		}
	}).catch(err => {
		res.status(500).json({message: "Deleting Posts Failed!"})
	})
})

module.exports = router;