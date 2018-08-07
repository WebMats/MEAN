const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

const postRoutesHandler = require('./routes/posts');
const userRoutesHandler = require('./routes/user');


// DB Connextion
const URI = require('./config/keys').MongoDBURI;
mongoose.connect(URI, { useNewUrlParser: true }).then(() => {
	console.log("Connection to MongoDB Atlas established.");
}).catch(err => {
	console.error(`ERROR: ${err}`)
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("api/images")));
// Handle CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", '*');
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
	next();
})
app.use('/api/posts', postRoutesHandler);
app.use('/api/user', userRoutesHandler);

module.exports = app;