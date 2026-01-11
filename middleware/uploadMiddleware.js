const multer = require('multer');//multer → handles file uploads (multipart/form-data)
const path = require('path');//path → helps read file paths and extensions safely

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save files to uploads folder   //destination
//When a file is uploaded, multer needs to know where to save it.
//cb(null, 'uploads/') → store file inside the uploads folder.
//null → means no error.
//filename
//Every uploaded file needs a name.
//Date.now() ensures the filename is unique.

  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // unique filename
  }
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extName) {
    cb(null, true);
  } else {
    cb('Only PDF, DOC, and DOCX files are allowed');
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;


/*✅ This handles:
✔ Saving resume
✔ Validating file type
✔ Naming files uniquely*/