const mongoose = require('mongoose')

const Post = require('./mondels/Post');




exports.create_post =(req,res,next) => {
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
}
exports.get_all_posts =(req, res, next) => {
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
	
}
exports.get_a_post =(req, res, next) => {
	Post.findById({_id: req.params.id}).then(post => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({message: "Post not found!"})
		}
	}).catch(err => {
		res.status(500).json({message: "Fetching Post Failed!"})
	})
}
exports.update_post =(req, res, next) => {
	if (req.file) {
		const url = `${req.protocol}://${req.get("host")}`
		let imagePath = `${url}/images/${req.file.filename}`;
		req.body.imagePath = imagePath;
	}
	req.body.creator = req.userData.userId
	Post.updateOne({_id: req.params.id, creator: req.userData.userId}, req.body).then(result => {
		if (result.n > 0) {
			res.status(200).json({message: "update succesful!"})	
		} else {
			res.status(401).json({message: "Could not update post!"})
		}
	}).catch(err => {
		res.status(500).json({message: "Updating post failed!"})
	})
}
exports.delete_post =(req, res, next) => {
	Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
		if (result.n > 0) {
			res.status(200).json({message: "Deletion succesful!"})	
		} else {
			res.status(401).json({message: "Not Authorized!"})
		}
	}).catch(err => {
		res.status(500).json({message: "Deleting Posts Failed!"})
	})
}