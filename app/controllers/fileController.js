const Form = require("../models/fileModels");
const { uploadToGoogleDrive, deleteFileFromGoogleDrive, getAllFilesFromGoogleDrive, updateFileNameInGoogleDrive   } = require("../service/googleDriveService");

const uploadFile = async (req, res) => {
  try {
    const { nama, nim, prodi } = req.body;
    const file = req.file;

    if (!nama || !nim || !prodi || !file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await uploadToGoogleDrive(file);

    if (response.status === 200) {
      const newForm = new Form({
        nama: nama,
        nim: nim,
        prodi: prodi,
        file: file.filename,
        googleDriveId: response.data.id, // Simpan ID Google Drive dalam dokumen MongoDB
      });

      await newForm.save();
    }

    return res
      .status(200)
      .json({ data: response, message: "Form data uploaded successfully" });
      
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getDataFromGoogleDrive = async (req, res) => {
  try {
    // 1. Ambil data file dari Google Drive menggunakan Google Service
    const files = await getAllFilesFromGoogleDrive();

    // 2. Ambil data dari MongoDB if needed
    const data = await Form.find();

    // Mengembalikan respons dengan data file dan data dari MongoDB
    res.status(200).json({ files, data });
  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ message: 'Failed to get data' });
  }
};

const deleteFile = async (req, res) => {
  const fileId = req.params.id; // Mendapatkan ID file dari parameter URL atau request body

  try {
    const file = await Form.findOneAndDelete({ googleDriveId: fileId }); // Menghapus dokumen berdasarkan googleDriveId

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
 
    await deleteFileFromGoogleDrive(fileId);
    
    return res .status(200) .json({ status:200, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Failed to delete file' });
  }
};

const updateFileName = async (req, res) => {
  const fileId = req.params.id; // Mendapatkan ID file dari parameter URL atau request body
  const { newName } = req.body; // Mendapatkan nama baru dari request body

  try {
    const file = await Form.findOneAndUpdate(
      { googleDriveId: fileId },
      { file: newName },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await updateFileNameInGoogleDrive(file.googleDriveId, newName);

    res.status(200).json({ status:200, message: 'File name updated successfully' });
  } catch (error) {
    console.error('Error updating file name:', error);
    res.status(500).json({ message: 'Failed to update file name' });
  }
};



module.exports = {
  uploadFile,
  getDataFromGoogleDrive,
  deleteFile,
  updateFileName
};
