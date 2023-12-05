const multer = require("multer");
const path = require("path");
//destinação da imagem ao repositório específico
const imageStorage = multer.diskStorage({
  //alteramos o destino padrão e o nome do arquivo padrão
  //para que fiquem diferentes daquele que o usuário envia
  //isso possibilitará envios de múltiplos arquivos com o mesmo nome
  destination: (req, file, cb) => {
    let folder = "";
    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }
    cb(null, `uploads/${folder}`);
  },

  filename: (req, file, cb) => {
    //gera um id único a partir do timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    // regex que irá aceitar uploads somente de arquivos png e jpg
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor, envie apenas arquivos PNG ou JPG."));
    }
    cb(undefined, true);
  },
});
module.exports = { imageUpload };
