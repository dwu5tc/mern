const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');

// load user model
const User = require('../../models/User');

// @route 	GET api/users/test
// @desc 	tests users route
// @ccess	public
router.get('/test', (req, res) => res.json({ msg: 'users works' })); // refers to /api/users/test

// @route 	GET api/users/register
// @desc	register user
// @access 	public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	// check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email })
		.then(user => {
			if (user) {
				errors.email = 'Email already exists';
				return res.status(400).json(errors);
			}

			const avatar = gravatar.url(req.body.email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password // should this actually be set???
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				})
			})
		})
		.catch(err => console.error);
});

// @route 	GET api/users/login
// @desc	login user and return jwt token
// @access 	public
router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email }).then(user => {
		if (!user) {
			return res.status(404).json({ email: 'User not found!' });
		}
		bcrypt.compare(password, user.password).then(isMatch => { // what about salts?
			if (isMatch) {
				// create jwt payload
				const payload = {
					id: user.id,
					name: user.name,
					avatar: user.avatar
				}

				// sign token
				return jwt.sign(
					payload,
					keys.secretOrKey,
					{ expiresIn: 3600 },// expire in 1h
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token
						});
						// handle the error???
					});
			} else {
				return res.status(400).json({ password: 'Password incorrect!' });
			}
			});
		}); // catch error???
});

// @route 	GET api/users/current
// @desc	return current user
// @access 	private
router.get('/current',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email
		});
		// what about errors???
	});
// if someone tries to access this route without setting header with a valid authorization token, they will get unauthorized

module.exports = router;