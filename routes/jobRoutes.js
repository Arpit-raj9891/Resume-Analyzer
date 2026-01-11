const express = require('express');
const router = express.Router();
const { createJob, getAllJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Only logged-in users (admins/recruiters) can post jobs
router.post('/', protect, createJob);

// Everyone can see job listings
router.get('/', getAllJobs);

module.exports = router;
