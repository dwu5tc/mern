const express = require('express');
const router = express.Router();

// @route 	GET api/users/test
// @desc 	tests users route
// @ccess	public
router.get('/test', (req, res) => res.json({ msg: 'users works' })); // refers to /api/users/test

module.exports = router;