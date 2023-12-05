const { body } = require("express-validator");
const photoInsertValidation = () => {
  return [
    body("title")
      .not()
      .equals("undefined")
      .withMessage("O título é obrigatório") //caso o usuário não tenha passado o título da foto
      .isString()
      .withMessage("O título é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O título precisa ter, no mínimo, 3 caracteres."),
    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória.");
      }
      return true;
    }),
  ];
};
const photoUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .isString() //é opcional, mas, se for enviado, é verificado
      .withMessage("O título é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O título precisa ter, no mínimo, 3 caracteres."),
  ];
};
const photoCommentValidation = () => {
  return [
    body("comments").isString().withMessage("Os comentários são obrigatórios."),
  ];
};
module.exports = {
  photoInsertValidation,
  photoUpdateValidation,
  photoCommentValidation,
};
