const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

// @route 	GET api/posts/test
// @desc 	tests posts route
// @access	public
router.get('/test', (req, res) => res.json({ msg: 'posts works' })); // refers to /api/posts/test


// @route 	GET api/posts
// @desc 	get posts
// @access	public
router.get('/', (req, res) => {
	Post.find().sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ posts: 'No posts found!' }));
});

// @route 	POST api/posts
// @desc 	get post by id
// @access	public
router.get('/:id', (req, res) => {
	Post.findById({ _id: req.params.id }).then(post => res.json(post))
		.catch(err => res.status(404).json({ post: 'No post found with that ID!' }))
});

// @route 	DELETE api/posts/:id
// @desc 	delete post by id
// @access	private
router.delete('/:id', 	
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findOneAndRemove({ _id: req.params.id, user: req.user.id }).then(post => {
		      return !post
		        ? res.status(401).json({ post: 'Post not found!' })
		        : res.status(200).json({ post: 'Post deleted!' });
		    }).catch(err => res.status(404).json({ post: 'There was an error deleting the post!' }));
	});

// @route 	POST api/posts/:id/like
// @desc 	like post
// @access	private
router.post('/:id/like', 	
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findOne({ _id: req.params.id }).then(post => {
			const index = post.likes.findIndex(like => like.user === req.user.id);

			if (index > -1) {
				return res.status(400).json({ post: 'User has already liked this post!' });
			}
			post.likes.push({ user: req.user.id });
			post.save.then(post => res.json(post));
		    }).catch(err => res.status(404).json({ post: 'There was an error deleting the post!' }));
	});

// @route 	POST api/posts/:id/unlike
// @desc 	unlike post
// @access	private
router.post('/:id/unlike', 	
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findOne({ _id: req.params.id }).then(post => {
			const index = post.likes.findIndex(like => like.user === req.user.id);

			if (index < 0) {
				return res.status(400).json({ post: 'User has not yet liked this post!' });
			}
			post.likes.splice(index, 1);
			post.save.then(post => res.json(post));
		    }).catch(err => res.status(404).json({ post: 'There was an error deleting the post!' }));
	});

// @route 	POST api/posts/:idd/comment
// @desc 	add comment to post
// @access	private
router.post(':id/comment/', 	
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findOne({ _id: req.params.id }).then(post => {
			const newComment = {
				user: req.user.id,
				text: req.body.text,
				name: req.body.name,
				avatar: req.body.avatar
			};

			post.comments.push(newComment);
			post.save.then(post => res.json(post));
		    }).catch(err => res.status(404).json({ post: 'Post not found!' }));
	});

// @route 	POST api/posts/:post_id/comment/:comment_id
// @desc 	delete comment from post
// @access	private
router.delete(
	'/:post_id/comment/:comment_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id).then(post => {
  	        if (!post) {
  	        	return res.status(404).json({ post: 'Post not found!' });
  	        }
  	        
  	        const comment = post.comments.find(comment => comment._id.toString() === req.params.comment_id);
  	        if (!comment) {
  	        	return res.status(404).json({ comment: 'Comment does not exist!' });
  	        }

  	        // check ownership
  	        if (post.user !== req.user.id && comment.user !== req.user.id) {
  	        	return res.status(401).json({ authorization: 'Unauthorized' });
  	        }
  	        
  	        // why use pull???
  	        post.update({ 
  	        	$pull: { 
  	        		comments: { 
  	        			_id: req.params.comment_id } 
  	        		} 
  	        	}).then(() => res.json({ success: true }))
  	        .catch(err => res.status(400).json({ post: 'Error deleting post!' }));
  	        }); // handle this???!!!
	});


// @route 	POST api/posts
// @desc 	create post
// @access	private
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