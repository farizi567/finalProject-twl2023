const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");
const { fileHandler } = require("../../middleware/multerHandler");
const fileController = require("../controllers/fileController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router
  .route("/upload")
  .post(fileHandler.single("file"), fileController.uploadFile);

module.exports = router;
