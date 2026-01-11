// controllers/jobController.js

const Job = require('../models/jobModel');
const sendEmail = require('../utils/emailService'); // expects sendEmail(to, subject, text)

/**
 * Create a new job
 * POST /api/jobs
 * Protected route (requires req.user from auth middleware)
 */
const createJob = async (req, res) => {
  try {
    const { title, company, location, description, skillsRequired = [], salary } = req.body;

    // Basic validation
    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Please fill all required fields (title, company, location, description)' });
    }

    // Create job document
    const job = await Job.create({
      title,
      company,
      location,
      description,
      skillsRequired,
      salary,
      postedBy: req.user._id, // set by auth middleware
    });

    // Send a notification email to the job poster (req.user.email)
    // If you want to notify other people later (admin, subscribers), change the recipient(s) here.
    try {
      const to = req.user.email || process.env.EMAIL_USER; // fallback to project email if user email missing
      const subject = `Job Posted Successfully: ${job.title}`;
      const text = `Hi ${req.user.name || ''},

Your job "${job.title}" at "${job.company}" has been posted successfully on CareerCraft.

Details:
- Location: ${job.location}
- Description: ${job.description}
${job.salary ? `- Salary: ${job.salary}` : ''}

You can view/manage your job in your dashboard.

Regards,
CareerCraft Team`;

      await sendEmail(to, subject, text);
      console.log('✅ Job creation email sent to:', to);
    } catch (emailError) {
      // Log the email error but do not fail the whole request because of email issues
      console.error('❌ Failed to send job creation email:', emailError.message || emailError);
    }

    return res.status(201).json(job);
  } catch (error) {
    console.error('createJob error:', error);
    return res.status(500).json({ message: 'Server error while creating job', error: error.message });
  }
};

/**
 * Get all jobs (public)
 * GET /api/jobs
 */
const getAllJobs = async (req, res) => {
  try {
    // Populate postedBy to include poster's name and email
    const jobs = await Job.find().populate('postedBy', 'name email');
    return res.status(200).json(jobs);
  } catch (error) {
    console.error('getAllJobs error:', error);
    return res.status(500).json({ message: 'Server error while fetching jobs', error: error.message });
  }
};

/**
 * (Optional) Get single job by id
 * GET /api/jobs/:id
 */
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    return res.status(200).json(job);
  } catch (error) {
    console.error('getJobById error:', error);
    return res.status(500).json({ message: 'Server error while fetching job', error: error.message });
  }
};

/**
 * (Optional) Delete job by id (only poster or admin)
 * DELETE /api/jobs/:id
 */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Only the poster or admin should be able to delete (simple check)
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: not allowed to delete this job' });
    }

    await job.remove();
    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('deleteJob error:', error);
    return res.status(500).json({ message: 'Server error while deleting job', error: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
};



/*const Job = require('../models/jobModel');

// POST /api/jobs - create new job
const createJob = async (req, res) => {
  try {
    const { title, company, location, description, skillsRequired, salary } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      skillsRequired,
      salary,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/jobs - get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getAllJobs };*/

/*const Job = require('../models/jobModel');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../services/emailService');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, description, skillsRequired } = req.body;

  if (!title || !company || !location || !description) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const job = await Job.create({
    title,
    company,
    location,
    description,
    skillsRequired,
    postedBy: req.user._id,
  });

  // ✅ Send email notification after job is created
  try {
    await sendEmail({
      to: req.user.email, // send to job poster
      subject: `Job Posted Successfully: ${title}`,
      text: `Your job "${title}" at ${company} has been successfully posted.\n\nDescription: ${description}\nLocation: ${location}`,
    });

    console.log('✅ Email sent successfully!');
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
  }

  res.status(201).json(job);
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name email');
  res.json(jobs);
});

module.exports = { createJob, getJobs };*/



