const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { matchRole } = require('../controllers/jobMatchController');

// POST /api/job/match
router.post('/match', protect, matchRole);

module.exports = router;
