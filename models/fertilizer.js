const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: String,
	description: String,
	price: { type: Number, required: true },
	inStock: { type: Boolean, default: true },
	info: String,
});

fertilizerSchema.methods.toggleInStock = function () {
	this.inStock = !this.inStock;
	this.save();
};

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
