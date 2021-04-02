const mongoose = require('mongoose');

const seedlingSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: String,
	description: String,
	price: { type: Number, required: true },
	inStock: { type: Boolean, default: true },
	info: String,
});

seedlingSchema.methods.toggleInStock = function () {
	this.inStock = !this.inStock;
	this.save();
};

module.exports = mongoose.model('Seedling', seedlingSchema);
