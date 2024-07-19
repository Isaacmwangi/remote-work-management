const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /pdf|doc|docx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter,
});

module.exports = upload;
