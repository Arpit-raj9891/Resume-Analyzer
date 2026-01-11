// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/admin/stats
// protected: user must be authenticated and an admin
router.get('/stats', protect, admin, getAdminStats);

module.exports = router;
