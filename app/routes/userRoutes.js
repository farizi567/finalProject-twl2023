const express = require("express");
const router = express.Router();
const multer = require("multer");

const { registerUser, loginUser } = require("../controllers/userController");
const fileController = require("../controllers/fileController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//NOTE - upload file
// Konfigurasi penyimpanan file menggunakan Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Filter untuk membatasi jenis file yang diunggah
const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOC files are allowed"), false);
  }
};

// Inisialisasi upload multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.route("/upload").post(upload.single("file"), fileController.uploadFile);

module.exports = router;
