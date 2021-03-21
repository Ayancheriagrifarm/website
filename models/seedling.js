const mongoose = require('mongoose');

const seedlingSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: String,
	description: String,
	price: { type: Number, required: true },
	info: String,
});

module.exports = mongoose.model('Seedling', seedlingSchema);
