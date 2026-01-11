const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const sendEmail = require('../utils/sendEmail');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume,
      coverLetter,
    });

    // Confirmation email
    await sendEmail({
      to: req.user.email,
      subject: 'Application Submitted Successfully',
      text: `You have successfully applied for the position: ${job.title}. We will get back to you soon!`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications (admin/recruiter)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id).populate('applicant', 'email name');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    // Notify applicant via email
    await sendEmail({
      to: application.applicant.email,
      subject: `Your Application Status: ${status}`,
      text: `Hello ${application.applicant.name},\n\nYour application status for the job "${application.job}" has been updated to "${status}".\n\nThank you.`,
    });

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
