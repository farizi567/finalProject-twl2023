const stream = require("stream");
const express = require("express");
const { google } = require("googleapis");

const multer = require("multer");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");
// const fileController = require("../controllers/fileController");
const upload = multer();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//NOTE - upload file
// // Konfigurasi penyimpanan file menggunakan Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// // Filter untuk membatasi jenis file yang diunggah
// const fileFilter = function (req, file, cb) {
//   if (
//     file.mimetype === "application/pdf" ||
//     file.mimetype === "application/msword" ||
//     file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF and DOC files are allowed"), false);
//   }
// };

// // Inisialisasi upload multer
// const upload = multer({ storage: storage, fileFilter: fileFilter });

// router.route("/upload").post(upload.single("file"), fileController.uploadFile);

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await google.drive({ version: "v3" }).files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: ["DRIVE_FOLDER_ID"],
    },
    fields: "id,name",
  });
  console.log(`Uploaded file ${data.name} ${data.id}`);
};

router.post("/upload", upload.any(), async (req, res) => {
  try {
    const { body, files } = req;

    for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f]);
    }

    console.log(body);
    res.status(200).send("Form Submitted");
  } catch (f) {
    res.send(f.message);
  }
});

module.exports = router;
