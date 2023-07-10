const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    nama: String,
    nim: String,
    prodi: String,
    file: String,
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
