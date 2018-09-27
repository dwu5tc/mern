const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => res.json({ msg: 'posts works' })); // refers to /api/posts/test

module.exports = router;