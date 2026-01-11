const express = require('express');
const router = express.Router();

const {
  uploadResume,
  analyzeResume,
  getMyAnalyses,
  getAnalysisById
} = require('../controllers/resumeController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ✅ Upload resume file (PDF/DOC/DOCX)
router.post('/upload', protect, upload.single('resume'), uploadResume);

// ✅ Analyze resume text (dummy AI for now)
router.post('/analyze', protect, analyzeResume);

// ✅ Get all analyses of the logged-in user
router.get('/history', protect, getMyAnalyses);

// ✅ Get a single analysis by ID (only if it belongs to the user)
router.get('/:id', protect, getAnalysisById);

module.exports = router;
