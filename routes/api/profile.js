const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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
	passport.authenticate('jwt', { session: false }),
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

// @route 	GET api/profile/all
// @desc 	get all profiles
// @ccess	public
router.get('/all', (req, res) => {
	const errors = {};
	Profile.find()
		.populate('user', ['name', 'avatar'])
		.then(profiles => {
			if (!profiles) { // shouldn't we check profiles.length???
				errors.profiles = 'There are no profiles!';
				return res.status(404).json(errors);
			}
			res.json(profiles);
		});
});

// @route 	GET api/profile/handle/:handle
// @desc 	get profile by handle
// @ccess	public
router.get('/handle/:handle', (req, res) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.profile = 'There is not profile for this user!';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json(err));
});

// @route 	GET api/profile/user/:user_id
// @desc 	get profile by user id
// @ccess	public
router.get('/user/:user_id', (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.profile = 'There is no profile for this user!';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json({ profile: 'There is no profile for this user!' })); // searching by id throws a different error!!!
});

// @route 	GET api/profile
// @desc 	create or edit user profile
// @ccess	private
router.post('/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validateProfileInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const profileFields = {};
		profileFields.user = req.user.id;
		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) profileFields.website = req.body.website;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.status) profileFields.status = req.body.status;

		if (typeof req.body.skills !== 'undefined') {
			profileFields.skills = req.body.skills.split(',');
		}

		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.github) profileFields.github = req.body.github;

		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
		if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

		Profile.findOne({ user: req.user.id })
			.populate('user', ['name', 'avatar']) // populate fields from user
			.then(profile => {
			if (profile) {
				// update
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true })
				.then(profile => res.json(profile));
			} else {
				// check if handle exists
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = 'That handle already exists!';
						res.status(400).json(errors);
					}
				});

				// create profile
				new Profile(profileFields).save()
					.then(profile => {
						res.json(profile);
					});
			}	
		}); // catch error???
	});

// @route 	GET api/profile/experience
// @desc 	add experience to profile
// @ccess	private
router.post('/experience', 
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validateExperienceInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// or array of props + for each to assign might be more dry
				const newExp = {
					title: req.body.title,
					company: req.body.company,
					location: req.body.location,
					from: req.body.from,
					to: req.body.to,
					current: req.body.current,
					description: req.body.description
				};

				profile.experience.unshift(newExp);
				profile.save()
					.then(profile => {
						res.json(profile)
					});
			}); // catch error???
	}); // catch error??? 

// @route 	GET api/profile/education
// @desc 	add education to profile
// @ccess	private
router.post('/education', 
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validateEducationInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// or array of props + for each to assign might be more dry
				const newEdu = {
					school: req.body.school,
					degree: req.body.degree,
					field: req.body.field,
					from: req.body.from,
					to: req.body.to,
					current: req.body.current,
					description: req.body.description
				};

				profile.education.unshift(newEdu);
				profile.save()
					.then(profile => {
						res.json(profile)
					});
			}); // catch error???
	}); // catch error??? 

// @route 	DELETE api/profile/experience/:exp_id
// @desc 	delete experience from profile
// @ccess	private
router.delete('/experience/:exp_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			const removeIndex = profile.experience.map(item => item.id)
				.indexOf(req.params.exp_id);

			profile.experience.splice(removeIndex, 1);

			profile.save().then(profile => res.json(profile));
		})
		.catch(err => res.status(404).json(err));
	});


// @route 	DELETE api/profile/education/:edu_id
// @desc 	delete education from profile
// @ccess	private
router.delete('/eduction/:edu_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			const removeIndex = profile.eduction.map(item => item.id)
				.indexOf(req.params.edu_id);

			profile.eduction.splice(removeIndex, 1);

			profile.save().then(profile => res.json(profile));
		})
		.catch(err => res.status(404).json(err));
	});

// @route 	DELETE api/profile
// @desc 	delete user and profile
// @ccess	private
// maybe makes more sense to have this in the users routes
router.delete('/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOneAndRemove({ user: req.user.id }).then(() => {
			User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }));
		});
	});




module.exports = router;