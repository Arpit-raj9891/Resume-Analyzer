const axios = require('axios');//Importing Axios, a library to make HTTP requests

const importLinkedInProfile = async (req, res) => {
  try {
    const { profileText, linkedinUrl } = req.body;

    if (!profileText && !linkedinUrl) {
      return res.status(400).json({ message: "Provide either profileText or linkedinUrl" });//Checks that the user has provided at least one input.
    }

    let extractedSkills = [];

    // 1️⃣ If text provided — extract simple keywords for now
    if (profileText) {
      const skills = [
        'JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'Angular', 'Django',
        'Data Analysis', 'SQL', 'HTML', 'CSS', 'C++', 'Java','Data Structures','Algorithms',
        'Project Management','Agile','Scrum','Communication','Team Leadership'
      ];

      // simple keyword-based matching
      extractedSkills = skills.filter(skill => 
        profileText.toLowerCase().includes(skill.toLowerCase())
      );
    }

    // 2️⃣ If LinkedIn URL provided — placeholder response for now
    if (linkedinUrl && !profileText) {
      return res.status(200).json({
        message: "LinkedIn URL import not implemented yet. Please paste profile text instead."
      });
    }

    return res.status(200).json({
      extractedSkills,
      totalSkillsFound: extractedSkills.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error importing LinkedIn data" });
  }
};

module.exports = { importLinkedInProfile };
