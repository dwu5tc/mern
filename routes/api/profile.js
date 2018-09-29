const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route 	GET api/profile/test
// @desc 	tests profile route
// @ccess	public
router.get('/test', (req, res) => res.json({ msg: 'profile works' })); // refers to /api/profile/test

// @route 	GET api/profile
// @desc 	get current users profile
// @ccess	private
router.get('/', 
	passport.authenticate('jwt', { session: false}), 
	(req, res) => {
		const errors = {};
		Profile.findOne({ user: req.user.id }).then(profile => {
			if (!profile) {
				errors.profile = 'There is no profile for this user!';
				return res.status(404).json(errors)
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json(err));
	});

module.exports = router;