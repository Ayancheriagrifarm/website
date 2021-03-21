const express = require('express');
const passport = require('passport');
const router = express.Router();

// Require Models

const User = require('../models/user');
const Carousel = require('../models/carousel');

// Require Middleware

const { isLoggedIn, isNotLoggedIn } = require('../middleware');

// Landing Page

router.get('/', async (req, res) => {
	try {
		const images = await Carousel.find();
		res.render('landing/landing', { images: images });
	} catch (err) {
		console.log(err);
	}
});

// Login Route

router.get('/login', isNotLoggedIn, (req, res) =>
	res.render('auth/login', { username: '' })
);

// Auth Login

router.post(
	'/login',
	isNotLoggedIn,
	passport.authenticate('local', {
		// successRedirect: '/project',
		failureRedirect: '/login',
		failureFlash: true,
	}),
	(req, res) => res.redirect('/seedlings')
);

// Add New User Route

// router.get('/register', (req, res) => res.render('auth/register', { user: new User() }));

// Add New User

// router.post('/register', async (req, res) => {
// 	const user = new User({ username: req.body.username });
// 	const password = req.body.password;
// 	const confirmPassword = req.body.confirmPassword;
// 	if (password === confirmPassword) {
// 		try {
// 			await User.register(user, req.body.password);
// 			req.flash('success', 'Successfully created an user');
// 			// passport.authenticate('local')(req, res, () => {})    //login with registered user
// 			res.redirect('/login');
// 		} catch (err) {
// 			console.log(err);
// 			res.render('auth/register', { user: user, error: err.message });
// 		}
// 	} else {
// 		res.render('auth/register', { user: user, error: 'Passwords do not match!' });
// 	}
// });

// Logout Route

router.get('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.flash('success', 'Successfully logged you out');
	res.redirect('/seedlings');
});

module.exports = router;
