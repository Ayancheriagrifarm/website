const express = require('express');
const router = express.Router();

// Require Models

const Fertilizer = require('../models/fertilizer');

// Require Middleware

const { isLoggedIn } = require('../middleware');

// Require Functions

const { escapeRegex } = require('../functions');

// Show All Fertilizers

router.get('/', async (req, res) => {
	let { search = '', skip = 0, limit = 6, sort = 'desc' } = req.query;
	skip = parseInt(skip) || 0;
	limit = parseInt(limit) || 1;
	let fertilizers;
	const meta = {
		skip: skip < 0 ? 0 : skip,
		limit: Math.min(50, Math.max(1, limit)),
	};
	try {
		if (search === '') {
			Fertilizer.countDocuments().then((count) => {
				meta.total = count;
				meta.has_more = count - (meta.skip + meta.limit) > 0;
			});
			fertilizers = await Fertilizer.find()
				.sort({ _id: sort === 'desc' ? -1 : 1 })
				.skip(meta.skip)
				.limit(meta.limit);
		} else {
			const regex = new RegExp(escapeRegex(search), 'gi');
			const temp = Fertilizer.find({ title: regex });
			meta.total = (await temp).length;
			meta.has_more = meta.total - (meta.skip + meta.limit) > 0;
			fertilizers = await Fertilizer.find({ title: regex })
				.sort({ _id: sort === 'desc' ? -1 : 1 })
				.skip(meta.skip)
				.limit(meta.limit);
		}
		if (req.header('Accept').includes('application/json'))
			res.status(200).send({
				data: fertilizers,
				meta: meta,
				isLoggedIn: req.isAuthenticated() ? true : false,
			});
		else if (fertilizers.length === 0)
			res.render('cards/card', {
				name: 'fertilizers',
				cards: fertilizers,
				nomatch: 'Nothing matches your search, please try again',
			});
		else res.render('cards/card', { name: 'fertilizers', cards: fertilizers });
	} catch (err) {
		console.log(err);
	}
});

// Add New Fertilizers Route

router.get('/new', isLoggedIn, (req, res) =>
	res.render('cards/new', { name: 'fertilizers', card: new Fertilizer() })
);

// Add New Fertilizers

router.post('/', isLoggedIn, async (req, res) => {
	const fertilizer = new Fertilizer({ ...req.body });
	try {
		await fertilizer.save();
		res.redirect('/fertilizers');
	} catch (err) {
		res.render('cards/new', {
			name: 'fertilizers',
			card: fertilizer,
			error: err.message,
		});
	}
});

// Show One Fertilizer

router.get('/:id', async (req, res) => {
	try {
		const fertilizer = await Fertilizer.findById(req.params.id);
		res.render('cards/show', { name: 'fertilizers', card: fertilizer });
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/fertilizers');
	}
});

// Toggle Instock

router.post('/:id/instock', isLoggedIn, async (req, res) => {
	try {
		const fertilizer = await Fertilizer.findById(req.params.id);
		await fertilizer.toggleInStock();
		res.redirect('back');
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

// Edit One Fertilizer

router.get('/:id/edit', isLoggedIn, async (req, res) => {
	try {
		const fertilizer = await Fertilizer.findById(req.params.id);
		res.render('cards/edit', { name: 'fertilizers', card: fertilizer });
	} catch (err) {
		req.flash('error', err.message);
		res.redirect(`/fertilizers/${req.params.id}`);
	}
});

// Update One Fertilizer

router.put('/:id', isLoggedIn, async (req, res) => {
	try {
		const fertilizer = await Fertilizer.findById(req.params.id);
		fertilizer.title = req.body.title;
		fertilizer.description = req.body.description;
		fertilizer.price = req.body.price;
		fertilizer.inStock = req.body.inStock === '1' ? true : false;
		fertilizer.info = req.body.info;
		await fertilizer.save();
		req.flash('success', 'Update successful');
		res.redirect(`/fertilizers/${req.params.id}`);
	} catch (err) {
		req.flash('error', 'Cannot update fertilizer');
		res.redirect(`/fertilizers/${req.params.id}`);
	}
});

// Delete One Fertilizer

router.delete('/:id', isLoggedIn, async (req, res) => {
	try {
		const fertilizer = await Fertilizer.findById(req.params.id);
		await fertilizer.remove();
		req.flash('success', 'Deleted a fertilizer');
		res.redirect('/fertilizers');
	} catch (err) {
		req.flash('error', 'Cannot delete fertilizer');
		res.redirect(`/fertilizers/${req.params.id}`);
	}
});

module.exports = router;
