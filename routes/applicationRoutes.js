const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

// User applies for a job
router.post('/apply', protect, applyForJob);

// Admin/recruiter fetches all applications
router.get('/', protect, admin, getAllApplications);

// Admin/recruiter updates an application status
router.put('/:id', protect, admin, updateApplicationStatus);

// Admin/recruiter deletes an application
router.delete('/:id', protect, admin, deleteApplication);

module.exports = router;
