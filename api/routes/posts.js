const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Post = require('../controllers/mondels/Post');


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



router.post('', upload.single('image'), (req,res,next) => {
	const url = `${req.protocol}://${req.get("host")}`
	req.body._id = mongoose.Types.ObjectId();
	const imagePath = `${url}/images/${req.file.filename}`;
	const post = new Post({...req.body, imagePath: imagePath})
	post.save().then(createdPost => {
		res.status(201).json({message: "Post added succesfully!", post: createdPost})
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
		return Post.count()
	}).then(count => {
		res.status(200).json({ message: "posts were fetched succesfully!", posts: fetchedPosts, maxPosts: count })
	}).catch(err => {
		console.log(err);
	})
	
})

router.get('/:id', (req, res, next) => {
	Post.findById({_id: req.params.id}).then(post => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({message: "Post not found!"})
		}
	})
})

router.patch('/:id', upload.single('image'), (req, res, next) => {
	if (req.file) {
		const url = `${req.protocol}://${req.get("host")}`
		let imagePath = `${url}/images/${req.file.filename}`;
		req.body.imagePath = imagePath;
	}
	Post.updateOne({_id: req.params.id}, req.body).then(result => {
		res.status(200).json({message: "update succesful!"})
	})
})

router.delete('/:id', (req, res, next) => {
	Post.deleteOne({_id: req.params.id}).then(result => {
		res.status(202).json({message: "Your post was Deleted!"})
	})
})

module.exports = router;