const express = require('express');
const router = express.Router();

// Require Models

const Carousel = require('../models/carousel');

// Require Middleware

const { isLoggedIn } = require('../middleware');

// Show All Images

router.get('/', isLoggedIn, async (req, res) => {
	try {
		const images = await Carousel.find();
		res.render('carousel/carousel', { images: images });
	} catch (err) {
		console.log('err');
	}
});

// Add New Images Route

router.get('/add', isLoggedIn, (req, res) =>
	res.render('carousel/add', { image: new Carousel() })
);

// Add New Images

router.post('/', isLoggedIn, async (req, res) => {
	const image = new Carousel({ ...req.body });
	try {
		await image.save();
		res.redirect('/carousel');
	} catch (err) {
		res.render('carousel/add', {
			image: image,
			error: err.message,
		});
	}
});

// Edit Images Route

router.get('/:id/edit', isLoggedIn, async (req, res) => {
	try {
		const image = await Carousel.findById(req.params.id);
		res.render('carousel/edit', { image: image });
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/carousel');
	}
});

// Update One Image

router.put('/:id', isLoggedIn, async (req, res) => {
	try {
		const image = await Carousel.findById(req.params.id);
		image.image = req.body.image;
		await image.save();
		req.flash('success', 'Update successful');
		res.redirect('/carousel');
	} catch (err) {
		req.flash('error', 'Cannot update image');
		res.redirect('/carousel');
	}
});

// Delete One Image

router.delete('/:id', isLoggedIn, async (req, res) => {
	try {
		const image = await Carousel.findById(req.params.id);
		await image.remove();
		req.flash('success', 'Deleted an image');
		res.redirect('/carousel');
	} catch (err) {
		req.flash('error', 'Cannot delete image');
		res.redirect('/carousel');
	}
});

module.exports = router;
