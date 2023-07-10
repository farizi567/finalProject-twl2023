const fs = require("fs");
const { google } = require("googleapis");

const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: `${__dirname}/googleCredential.json`,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};

exports.uploadToGoogleDrive = async (file) => {
  const auth = authenticateGoogle();
  const fileMetadata = {
    name: file.originalname,
    parents: ["1Ae2kNhU5lnj0-khq_NirbUTVVbBPNY5-"],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const driveService = google.drive({ version: "v3", auth });

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id,name",
  });
  console.log(response);
  return response;
};

exports.deleteFromGoogleDrive = async (imageID) => {
  const auth = authenticateGoogle();
  const driveService = google.drive({ version: "v3", auth });
  const response = await driveService.files.delete({
    fileId: imageID,
  });
  return response;
};
