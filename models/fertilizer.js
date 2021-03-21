const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: String,
	description: String,
	price: { type: Number, required: true },
	info: String,
});

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
