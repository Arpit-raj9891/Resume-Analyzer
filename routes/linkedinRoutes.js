// routes/linkedinRoutes.js
const express = require('express');
const router = express.Router();
const { importLinkedInProfile } = require('../controllers/linkedinController');
const { protect } = require('../middleware/authMiddleware');

// Protected route (requires login)
router.post('/import', protect, importLinkedInProfile);

module.exports = router;
