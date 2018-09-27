const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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
	User.findOne({ email: req.body.email })
		.then(user => {
			if (user) {
				return res.status(400).json({ email: 'Email already exists' });
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
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				})
			})
		})
		.catch(err => console.error);
});

module.exports = router;