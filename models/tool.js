const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: String,
	description: { type: String },
	price: { type: Number, required: true },
	inStock: { type: Boolean, default: true },
	info: String,
});

toolSchema.methods.toggleInStock = function () {
	this.inStock = !this.inStock;
	this.save();
};

module.exports = mongoose.model('Tool', toolSchema);
