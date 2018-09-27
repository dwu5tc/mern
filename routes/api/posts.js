const express = require('express');
const router = express.Router();

// @route 	GET api/posts/test
// @desc 	tests posts route
// @ccess	public
router.get('/test', (req, res) => res.json({ msg: 'posts works' })); // refers to /api/posts/test

module.exports = router;