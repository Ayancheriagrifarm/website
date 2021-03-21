const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: String,
	description: { type: String },
	price: { type: Number, required: true },
	info: String,
});

module.exports = mongoose.model('Tool', toolSchema);
