const Form = require("../models/fileModels");

const uploadFile = async (req, res) => {
  try {
    const { nama, nim, prodi } = req.body;
    const file = req.file;

    if (!nama || !nim || !prodi || !file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newForm = new Form({
      nama: nama,
      nim: nim,
      prodi: prodi,
      file: file.filename,
    });

    await newForm.save();

    return res.status(200).json({ message: "Form data uploaded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  uploadFile,
};
