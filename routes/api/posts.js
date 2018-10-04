const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

// @route 	GET api/posts/test
// @desc 	tests posts route
// @ccess	public
router.get('/test', (req, res) => res.json({ msg: 'posts works' })); // refers to /api/posts/test

// @route 	POST api/posts
// @desc 	create post
// @ccess	private
router.post('/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			res.status(400).json(errors);
		}

		console.log(req.user);

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name, // will pull name and avatar from the redux store
			avatar: req.body.avatar, // why can't we just grab from req.user???!!!
			user: req.user.id
		});

		newPost.save().then(post => res.json(post)); // error handling???
	});

module.exports = router;