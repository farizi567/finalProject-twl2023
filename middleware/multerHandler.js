const Multer = require("multer");
const fs = require("fs");

exports.fileHandler = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, `${__dirname}/../uploads/`);
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "_" + Date.now() + "_" + file.originalname
      );
    },
  }),
});

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, () => {
    console.log("file deleted");
  });
};
