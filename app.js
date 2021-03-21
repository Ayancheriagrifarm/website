if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const localStrategy = require('passport-local').Strategy;

const app = express();

// Require Models

const User = require('./models/user.js');

// Require Routes

const authRoutes = require('./routes/auth');
const seedlingsRoutes = require('./routes/seedling');
const fertilizersRoutes = require('./routes/fertilizer');
const carouselRoutes = require('./routes/carousel');
const toolsRoutes = require('./routes/tool');

// Mongodb Connect

mongoose
	.connect(process.env.DATABASE_URL, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB Connected....'))
	.catch((err) => console.log(err));

// EJS, Views, Layouts, Bodyparser

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ limit: '16mb', extended: true }));

// Express Session

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// Use MethodOverride, Flash

app.use(methodOverride('_method'));
app.use(flash());

// Passport Session Auth

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

// Global Variable Declaration

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// Use Routes

app.use('/', authRoutes);
app.use('/seedlings', seedlingsRoutes);
app.use('/fertilizers', fertilizersRoutes);
app.use('/tools', toolsRoutes);
app.use('/carousel', carouselRoutes);

app.get('*', (req, res) => res.status(404).render('error/error'));

// Server Listen

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server Started on port ${PORT}....`));
