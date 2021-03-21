// Check User isLoggedIn

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	req.flash('error', 'You must be signed in to do that');
	res.redirect('/login');
};

// Check User isNotLoggedIn

const isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) return next();
	req.flash('error', 'You must logout first');
	res.redirect('/seedlings');
};

module.exports = { isLoggedIn, isNotLoggedIn };
