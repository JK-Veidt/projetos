const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
//inserção de foto com usuário relacionado
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;
  // console.log(req.body);
  const reqUser = req.user;
  //pega o usuário para associar seu id à foto que está sendo inserida
  const user = await User.findById(reqUser._id);
  //cria a nova foto
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });
  //se a criação da foto deu erro, retorna mensagem
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."],
    });
    return;
  }
  //se foi bem-sucedida, retorna a foto
  res.status(201).json(newPhoto);
};
//remoção de foto
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;
  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
    //verifica se a foto existe ou não
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }
    //verifica se a foto pertence ao usuário, pois apenas o dono da imagem pode
    removê - la;
    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] }); //erro
      genérico;
      return;
    }
    await Photo.findByIdAndDelete(photo._id);
    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso." });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
  }
};
//retornar todas as fotos
const getAllPhotos = async (req, res) => {
  //a função find executa um filtro; se levar um parâmetro vazio, busca todos
  //a função sort com os parâmetros abaixo ordena a lista de fotos da mais recente para a mais antiga
  //desta forma, no frontend, as fotos mais novas serão exibidas sempre no topo da
  lista;
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();
  res.status(200).json(photos);
};
//retornar fotos de usuário
const getUserPhotos = async (req, res) => {
  //o usuário pode visualizar fotos de outros usuários, portanto, neste caso, o ID é pego diretamente da URL
  const { id } = req.params;
  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();
  res.status(200).json(photos);
};
//retornar uma foto pelo id
const getPhotoById = async (req, res) => {
  const { id } = req.params;
  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
    //caso não exista, envia mensagem de erro
    if (!photo) {
      res.status(404).json({ errors: ["A foto não foi encontrada."] });
      return;
    }
    //se achou, retorna a foto
    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({ errors: ["A foto não foi encontrada."] });
  }
};
//atualização de foto
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const { title } = req.body; //só podemos atualizar o título da foto, essa é uma regra de negócios da nossa aplicação
    const reqUser = req.user;
    const photo = await Photo.findById(id);
    //caso não exista, envia mensagem de erro
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }
    //verifica se a foto pertence ao usuário, pois apenas o dono da imagem pode
    alterá - la;
    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] }); //erro
      genérico;
      return;
    }
    if (title) {
      photo.title = title;
    }
    await photo.save();
    res.status(200).json({ photo, message: "Foto atualizada com sucesso." });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
  }
};
//associação de likes
const likePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const reqUser = req.user;
    const photo = await Photo.findById(id);
    //caso não exista, envia mensagem de erro
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }
    //verifica se o usuário já curtiu a foto anteriormente
    if (photo.likes.includes(reqUser._id)) {
      res.status(422).json({ errors: ["Você já curtiu essa foto."] });
      return;
    }
    // se ainda não curtiu, adiciona o ID do usuário ao array de likes da foto
    photo.likes.push(reqUser._id);
    await photo.save();
    res.status(200).json({
      photoId: id,
      userId: reqUser._id,
      message: "Foto curtida com sucesso.",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
  }
};
//associação de comentários
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const { comments } = req.body;
    const reqUser = req.user;
    const user = await User.findById(reqUser._id);
    //caso não exista, envia mensagem de erro
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }
    const photo = await Photo.findById(id);
    //caso não exista, envia mensagem de erro
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }
    //se a foto existe, associa o comentário à mesma
    const userComment = {
      comments,
      userName: user.name,
      userImage: user.profileImage,
      userId: user._id,
    };
    if (comments) {
      photo.comments.push(userComment);
    }
    await photo.save();
    res.status(200).json({
      userComment,
      message: "Comentário atribuído com sucesso.",
    });
  } catch (error) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde."], //erro
      genérico,
    });
  }
};
//buscar fotos por título
const searchPhotos = async (req, res) => {
  const { q } = req.query; //argumento que vem da query string da URL
  //expressão regular que irá buscar a substring em qualquer lugar do título e ignorar o case sensitive
  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();
  res.status(200).json(photos);
};
module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
