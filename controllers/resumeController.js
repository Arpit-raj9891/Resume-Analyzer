const Analysis = require('../models/analysisModel');
const axios = require('axios'); // (for future AI microservice)
const pdfParse = require('pdf-parse'); // Extract text from PDF
const fs = require('fs'); // Read uploaded file from disk

/**
 * ✅ PART 1 — Upload Resume (PDF/DOC/DOCX)
 * - Saves file using Multer
 * - Extracts text using pdf-parse (PDF only for now)
 * - Creates an empty analysis record (AI will fill data later)
 */
const uploadResume = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    // Read uploaded file from uploads/
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);

    // Extract text from PDF
    const pdfResult = await pdfParse(fileData);
    const extractedText = pdfResult.text || "";

    // Create an initial empty analysis entry
    const analysis = await Analysis.create({
      user: req.user._id,
      resumeText: extractedText,
      extractedSkills: [],
      suggestedRoles: [],
      score: null,
      feedback: ''
    });

    res.status(200).json({
      message: "Resume uploaded successfully",
      analysisId: analysis._id,
      extractedText,
    });

  } catch (error) {
    console.error("Upload Resume Error:", error);
    res.status(500).json({ message: "Error uploading resume" });
  }
};


/**
 * ✅ PART 2 — Analyze Resume (Dummy AI for now)
 * - Uses extracted resume text
 * - Matches skills from a dummy list
 * - Generates score and suggestions
 * - Saves a NEW analysis entry
 */
const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    // Dummy list of skills (AI will replace this later)
    const dummySkills = ["JavaScript", "React", "Node.js", "MongoDB", "CSS", "HTML"];

    // Naive text matching
    const matchedSkills = dummySkills.filter(skill =>
      resumeText.toLowerCase().includes(skill.toLowerCase())
    );

    const score = Math.floor((matchedSkills.length / dummySkills.length) * 100);

    const feedback = `Your resume shows good proficiency in ${matchedSkills.join(', ') || 'some key areas'}.`;

    const suggestedRoles =
      score > 70
        ? ["Full Stack Developer", "Frontend Developer"]
        : ["Junior Developer", "Web Designer"];

    // Save analysis result
    const analysis = await Analysis.create({
      user: req.user._id,
      resumeText,
      extractedSkills: matchedSkills,
      suggestedRoles,
      score,
      feedback,
    });

    res.status(200).json({
      message: "Resume analyzed successfully",
      analysis,
    });

  } catch (error) {
    console.error("Analyze Resume Error:", error);
    res.status(500).json({ message: "Error analyzing resume" });
  }
};


/**
 * ✅ PART 3 — Get All Analyses for the Logged-in User
 * - Returns history of resume analyses
 * - Sorted newest → oldest
 */
const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: analyses.length,
      analyses
    });

  } catch (error) {
    console.error("Get My Analyses Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * ✅ PART 4 — Get One Analysis by ID
 * - User can only access their own analysis
 */
const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // Ensure the logged-in user owns this analysis
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: Not your analysis" });
    }

    res.status(200).json({ analysis });

  } catch (error) {
    console.error("Get Analysis By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅Export all functions
module.exports = {
  uploadResume,
  analyzeResume,
  getMyAnalyses,
  getAnalysisById
};
