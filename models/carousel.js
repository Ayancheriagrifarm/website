const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({ image: String });

module.exports = mongoose.model('Carousel', carouselSchema);
