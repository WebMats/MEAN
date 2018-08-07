const mongoose = require('mongoose');


const Structure = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
    title: {type: String, required: true},
    content: {type: String, required: true},
    imagePath: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}
});

module.exports = mongoose.model("Post", Structure);