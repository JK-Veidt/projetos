const express = require("express");
const router = express.Router();
// controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
} = require("../controllers/PhotoController");
// middleware
const {
  photoInsertValidation,
  photoUpdateValidation,
  photoCommentValidation,
} = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");
// rotas
router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);
//rota com id dinâmico, o usuário precisa estar autenticado
router.delete("/:id", authGuard, deletePhoto);
router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos);
//precisa ser criada antes da rota dinâmica com GET, para não haver confusão do Express
router.get("/search", authGuard, searchPhotos);
router.get("/:id", authGuard, getPhotoById);
router.patch("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
router.patch("/like/:id", authGuard, likePhoto);
router.patch(
  "/comment/:id",
  authGuard,
  photoCommentValidation(),
  validate,
  commentPhoto
);
module.exports = router;
