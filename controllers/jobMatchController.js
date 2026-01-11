const natural = require('natural');

// A predefined skill/keyword bank (expand as needed)
const SKILL_KEYWORDS = [
  "javascript", "node", "node.js", "express", "react", "mongodb", "mysql",
  "python", "java", "c++", "html", "css", "aws", "docker", "kubernetes",
  "rest api", "data structures", "algorithms", "git", "github", "devops",
  "machine learning", "ml", "deep learning", "nlp", "linux"
];

// helper: normalize text
const normalize = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9+.\s]/g, " ");
};

// helper: extract skills from text
const extractSkills = (text) => {
  const normalized = normalize(text);
  const extracted = [];

  SKILL_KEYWORDS.forEach(skill => {
    if (normalized.includes(skill.toLowerCase())) {
      extracted.push(skill);
    }
  });

  return [...new Set(extracted)];
};

exports.matchRole = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "resumeText and jobDescription are required"
      });
    }

    // Extract candidate skills
    const resumeSkills = extractSkills(resumeText);
    
    // Extract job requirement skills
    const jobSkills = extractSkills(jobDescription);

    // Calculate matches
    const matchedSkills = resumeSkills.filter(s => jobSkills.includes(s));
    const missingSkills = jobSkills.filter(s => !resumeSkills.includes(s));

    // Match Score
    const matchPercent = jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

    return res.status(200).json({
      matchPercent,
      matchedSkills,
      missingSkills,
      suggestedKeywords: missingSkills,
      totalResumeSkills: resumeSkills.length,
      totalJobSkills: jobSkills.length
    });

  } catch (error) {
    console.error("Role match error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
