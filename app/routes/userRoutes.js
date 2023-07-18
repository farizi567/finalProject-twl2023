const express = require("express");

const router = express.Router();

const { registerUser, loginUser, getDataUser } = require("../controllers/userController");
const { fileHandler } = require("../../middleware/multerHandler");
const fileController = require("../controllers/fileController");
const {getDataFromGoogleDrive, deleteFile, updateFileName} = require("../controllers/fileController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(getDataUser);
router.route("/upload").post(fileHandler.single("file"), fileController.uploadFile);
router.route("/getFiles" ).get(getDataFromGoogleDrive)
router.route("/files/:id").delete(deleteFile);
router.route("/files/:id").put(updateFileName)

module.exports = router;
