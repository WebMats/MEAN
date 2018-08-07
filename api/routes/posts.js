const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post');
const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');


router.post('', checkAuth, extractFile, PostController.create_post)

router.get('', PostController.get_all_posts)

router.get('/:id', PostController.get_a_post)

router.patch('/:id', checkAuth, extractFile, PostController.update_post)

router.delete('/:id', checkAuth, PostController.delete_post)

module.exports = router;