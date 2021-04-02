const express = require('express');
const router = express.Router();

// Require Models

const Seedling = require('../models/seedling');

// Require Middleware

const { isLoggedIn } = require('../middleware');

// Require Functions

const { escapeRegex } = require('../functions');

// Show All Seedlings

router.get('/', async (req, res) => {
	let { search = '', skip = 0, limit = 6, sort = 'desc' } = req.query;
	skip = parseInt(skip) || 0;
	limit = parseInt(limit) || 1;
	let seedlings;
	const meta = {
		skip: skip < 0 ? 0 : skip,
		limit: Math.min(50, Math.max(1, limit)),
	};
	try {
		if (search === '') {
			Seedling.countDocuments().then((count) => {
				meta.total = count;
				meta.has_more = count - (meta.skip + meta.limit) > 0;
			});
			seedlings = await Seedling.find()
				.sort({ _id: sort === 'desc' ? -1 : 1 })
				.skip(meta.skip)
				.limit(meta.limit);
		} else {
			const regex = new RegExp(escapeRegex(search), 'gi');
			const temp = Seedling.find({ title: regex });
			meta.total = (await temp).length;
			meta.has_more = meta.total - (meta.skip + meta.limit) > 0;
			seedlings = await Seedling.find({ title: regex })
				.sort({ _id: sort === 'desc' ? -1 : 1 })
				.skip(meta.skip)
				.limit(meta.limit);
		}
		// switch (req.accepts('html', 'json')) //switch case
		// if (req.accepts('json'))
		if (req.header('Accept').includes('application/json'))
			res.status(200).send({
				data: seedlings,
				meta: meta,
				isLoggedIn: req.isAuthenticated() ? true : false,
			});
		else if (seedlings.length === 0)
			res.render('cards/card', {
				name: 'seedlings',
				cards: seedlings,
				nomatch: 'Nothing matches your search, please try again',
			});
		else res.render('cards/card', { name: 'seedlings', cards: seedlings });
	} catch (err) {
		console.log(err);
	}
});

// Add New Seedlings Route

router.get('/new', isLoggedIn, (req, res) =>
	res.render('cards/new', { name: 'seedlings', card: new Seedling() })
);

// Add New Seedlings

router.post('/', isLoggedIn, async (req, res) => {
	const seedling = new Seedling({ ...req.body });
	try {
		await seedling.save();
		res.redirect('/seedlings');
	} catch (err) {
		res.render('cards/new', { name: 'seedlings', card: seedling, error: err.message });
	}
});

// Show One Seedling

router.get('/:id', async (req, res) => {
	try {
		const seedling = await Seedling.findById(req.params.id);
		res.render('cards/show', { name: 'seedlings', card: seedling });
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/seedlings');
	}
});

// Toggle Instock

router.post('/:id/instock', isLoggedIn, async (req, res) => {
	try {
		const seedling = await Seedling.findById(req.params.id);
		await seedling.toggleInStock();
		res.redirect('back');
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

// Edit One Seedling

router.get('/:id/edit', isLoggedIn, async (req, res) => {
	try {
		const seedling = await Seedling.findById(req.params.id);
		res.render('cards/edit', { name: 'seedlings', card: seedling });
	} catch (err) {
		req.flash('error', err.message);
		res.redirect(`/seedlings/${req.params.id}`);
	}
});

// Update One Seedling

router.put('/:id', isLoggedIn, async (req, res) => {
	try {
		const seedling = await Seedling.findById(req.params.id);
		seedling.title = req.body.title;
		seedling.image = req.body.image;
		seedling.description = req.body.description;
		seedling.price = req.body.price;
		seedling.inStock = req.body.inStock === '1' ? true : false;
		seedling.info = req.body.info;
		await seedling.save();
		req.flash('success', 'Update successful');
		res.redirect(`/seedlings/${req.params.id}`);
	} catch (err) {
		req.flash('error', 'Cannot update seedling');
		res.redirect(`/seedlings/${req.params.id}`);
	}
});

// Delete One Seedling

router.delete('/:id', isLoggedIn, async (req, res) => {
	try {
		const seedling = await Seedling.findById(req.params.id);
		await seedling.remove();
		req.flash('success', 'Deleted a seedling');
		res.redirect('/seedlings');
	} catch (err) {
		req.flash('error', 'Cannot delete seedling');
		res.redirect(`/seedlings/${req.params.id}`);
	}
});

module.exports = router;
