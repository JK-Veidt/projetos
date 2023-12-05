const mongoose = require("mongoose");
const { Schema } = mongoose;
const photoSchema = new Schema(
  {
    image: String, //caminho do arquivo
    title: String,
    likes: Array,
    comments: Array,

    //usuário que inseriu a foto (é uma string diferente, padrão mongoose)
    userId: mongoose.ObjectId,

    //para associar o nome do usuário à foto
    userName: String,
  },
  {
    timestamps: true,
  }
);
const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;
