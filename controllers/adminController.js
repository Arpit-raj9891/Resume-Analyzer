// controllers/adminController.js

const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Analysis = require('../models/analysisModel'); // Analysis model created earlier

/**
 * GET /api/admin/stats
 * Admin-only: returns basic analytics for dashboard
 */
const getAdminStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();

    // Analysis-related stats (if there are any analysis documents)
    // totalAnalyses and average score (avgScore)
    const totalAnalyses = await Analysis.countDocuments();

    // Compute average score using aggregation; fallback to 0 if no analyses
    const avgResult = await Analysis.aggregate([
      { $match: { score: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);

    const avgScore = (avgResult && avgResult.length > 0) ? Number(avgResult[0].avgScore.toFixed(2)) : 0;

    // Optional: top missing skills or most common extracted skills (if you store extractedSkills array)
    // We'll compute top extracted skills across analyses if the field exists
    const topSkillsResult = await Analysis.aggregate([
      { $unwind: "$extractedSkills" },
      { $group: { _id: "$extractedSkills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topSkills = topSkillsResult.map(item => ({ skill: item._id, count: item.count }));

    // Response payload
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalAnalyses,
        avgScore,
        topSkills
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAdminStats };
