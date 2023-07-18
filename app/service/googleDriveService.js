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

exports.getAllFilesFromGoogleDrive = async () => {
  try {
    const auth = authenticateGoogle();
    const driveService = google.drive({ version: "v3", auth });

    const response = await driveService.files.list({
      fields: "files(id, name)",
      q: "mimeType != 'application/vnd.google-apps.folder'",
    });

    return response.data.files;
  } catch (error) {
    console.error("Error getting files from Google Drive:", error);
    throw error;
  }
};

exports.deleteFileFromGoogleDrive = async (imageID) => {
  const auth = authenticateGoogle();
  const driveService = google.drive({ version: "v3", auth });
  const response = await driveService.files.delete({
    fileId: imageID,
  });
  return response;
};

exports.updateFileNameInGoogleDrive = async (googleDriveId, newName) => {
  const auth = authenticateGoogle();
  const driveService = google.drive({ version: 'v3', auth });

  try {
    const response = await driveService.files.update({
      fileId: googleDriveId,
      requestBody: {
        name: newName
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating file name in Google Drive:', error);
    throw error;
  }
};

