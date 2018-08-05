const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const Structure = new mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

Structure.plugin(uniqueValidator);

module.exports = mongoose.model("User", Structure);