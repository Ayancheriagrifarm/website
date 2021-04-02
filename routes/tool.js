const express = require('express');
const router = express.Router();

// Require Models

const Tool = require('../models/tool');

// Require Middleware

const { isLoggedIn } = require('../middleware');

// Require Functions

const { escapeRegex } = require('../functions');

// Show All Tools

router.get('/', async (req, res) => {
	let { search = '', skip = 0, limit = 6, sort = 'desc' } = req.query;
	skip = parseInt(skip) || 0;
	limit = parseInt(limit) || 1;
	let tools;
	const meta = {
		skip: skip < 0 ? 0 : skip,
		limit: Math.min(50, Math.max(1, limit)),
	};
	try {
		if (search === '') {
			Tool.countDocuments().then((count) => {
				meta.total = count;
				meta.has_more = count - (meta.skip + meta.limit) > 0;
			});
			tools = await Tool.find()
				.sort({ _id: sort === 'desc' ? -1 : 1 })
				.skip(meta.skip)
				.limit(meta.limit);
		} else {
			const regex = new RegExp(escapeRegex(search), 'gi');
			const temp = Tool.find({ title: regex });
			meta.total = (await temp).length;
			meta.has_more = meta.total - (meta.skip + meta.limit) > 0;
			tools = await Tool.find({ title: regex })
				.sort({ _id: sort === 'desc' ? -1 : 1 })
				.skip(meta.skip)
				.limit(meta.limit);
		}
		if (req.header('Accept').includes('application/json'))
			res.status(200).send({
				data: tools,
				meta: meta,
				isLoggedIn: req.isAuthenticated() ? true : false,
			});
		else if (tools.length === 0)
			res.render('cards/card', {
				name: 'tools',
				cards: tools,
				nomatch: 'Nothing matches your search, please try again',
			});
		else res.render('cards/card', { name: 'tools', cards: tools });
	} catch (err) {
		console.log(err);
	}
});

// Add New Tools Route

router.get('/new', isLoggedIn, (req, res) =>
	res.render('cards/new', { name: 'tools', card: new Tool() })
);

// Add New Tools

router.post('/', isLoggedIn, async (req, res) => {
	const tool = new Tool({ ...req.body });
	try {
		await tool.save();
		res.redirect('/tools');
	} catch (err) {
		res.render('cards/new', { name: 'tools', card: tool, error: err.message });
	}
});

// Show One Tool

router.get('/:id', async (req, res) => {
	try {
		const tool = await Tool.findById(req.params.id);
		res.render('cards/show', { name: 'tools', card: tool });
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/tools');
	}
});

// Toggle Instock

router.post('/:id/instock', isLoggedIn, async (req, res) => {
	try {
		const tool = await Tool.findById(req.params.id);
		await tool.toggleInStock();
		res.redirect('back');
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('back');
	}
});

// Edit One Tool

router.get('/:id/edit', isLoggedIn, async (req, res) => {
	try {
		const tool = await Tool.findById(req.params.id);
		res.render('cards/edit', { name: 'tools', card: tool });
	} catch (err) {
		req.flash('error', err.message);
		res.redirect(`/tools/${req.params.id}`);
	}
});

// Update One Tool

router.put('/:id', isLoggedIn, async (req, res) => {
	try {
		const tool = await Tool.findById(req.params.id);
		tool.title = req.body.title;
		tool.description = req.body.description;
		tool.price = req.body.price;
		tool.inStock = req.body.inStock === '1' ? true : false;
		tool.info = req.body.info;
		await tool.save();
		req.flash('success', 'Update successful');
		res.redirect(`/tools/${req.params.id}`);
	} catch (err) {
		req.flash('error', 'Cannot update tool');
		res.redirect(`/tools/${req.params.id}`);
	}
});

// Delete One Tool

router.delete('/:id', isLoggedIn, async (req, res) => {
	try {
		const tool = await Tool.findById(req.params.id);
		await tool.remove();
		req.flash('success', 'Deleted a tool');
		res.redirect('/tools');
	} catch (err) {
		req.flash('error', 'Cannot delete tool');
		res.redirect(`/tools/${req.params.id}`);
	}
});

module.exports = router;
