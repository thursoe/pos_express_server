const multer = require("multer");

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const isValidFileType = allowedFileTypes.test(file.originalname.toLowerCase()) && allowedFileTypes.test(file.mimetype);

  isValidFileType ? cb(null, true) : cb(new Error("Only images with jpeg, jpg, or png format are allowed."));
};


const opts = {
  //fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 1MB
  },
};

module.exports = multer(opts);
