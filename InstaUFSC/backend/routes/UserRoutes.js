const express = require("express");
const router = express.Router();
//controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
} = require("../controllers/UserController");

//middleware
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");
//rotas
router.post("/register", userCreateValidation(), validate, register); //será uma rota de post, define-se o caminho e associa-se a função
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard, //precisa estar autenticado para poder atualizar o usuário
  userUpdateValidation(), //invocação da função de validação de usuário
  validate, //função de validação básica do express para erros da API
  imageUpload.single("profileImage"),
  update
);
//desta vez a rota possui um parâmetro dinâmico, definido por "/:id"
//esta rota também não necessita de middlewares, porque todos os usuários pode verqualquer perfil de usuário
router.get("/:id", getUserById);
module.exports = router;
