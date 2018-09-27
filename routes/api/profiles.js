const express = require('express');
const router = express.Router();

// @route 	GET api/profiles /test
// @desc 	tests profiles route
// @ccess	public
router.get('/test', (req, res) => res.json({ msg: 'profiles works' })); // refers to /api/profiles/test

module.exports = router;