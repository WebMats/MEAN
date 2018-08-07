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


module.exports = upload.single('image');