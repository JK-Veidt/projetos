const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const mongoose = require("mongoose");
//geração de token de usuário
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};
//registrar-se e logar-se
const register = async (req, res) => {
  // res.send("Registro efetuado.");
  const { name, email, password } = req.body;
  //verificar se o usuário existe
  const user = await User.findOne({ email }); //o e-mail é único dentro do nosso sistema;
  if (user) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail."] });
  }
  //gerar o hash da senha
  const salt = await bcrypt.genSalt(); //chave aleatória
  const passwordHash = await bcrypt.hash(password, salt);
  //criar o usuário
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });
  //se a criação do usuário foi bem-sucedida, retornar o token gerado
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde"] });
    //erro genérico, é preciso identificar nos logs do sistema o que ocorreu
    return;
  }
  res.status(201).json({
    _id: newUser._id, //envia o id do usuário para ser usado pelo frontend
    token: generateToken(newUser._id),
  });
};
//Sign in do usuário
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //verificar se o usuário existe
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }
  //verificar se a password é correta
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha incorreta."] });
    return;
  }
  //se tudo deu certo, retorna o usuário com seu token
  res.status(200).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};
//retonar o usuário atualmente logado
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};
//atualização de usuário
const update = async (req, res) => {
  // res.send("Atualização de Usuário.");
  const { name, password, bio } = req.body; //campos opcionais, podem vir ou não com a requisição
  let profileImage = null;
  //verificar se chegou algum arquivo serializado junto com a requisição
  if (req.file) {
    profileImage = req.file.filename; //nome que criamos na função imageStorage
    imageUpload.js;
  }
  const reqUser = req.user;
  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");
  //se foi enviado um novo nome, procedemos com a atualização dele
  if (name) {
    user.name = name;
  }
  //se foi enviada uma nova senha, procedemos com sua atualização
  if (password) {
    //gerar novo hash de senha
    const salt = await bcrypt.genSalt(); //chave aleatória
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;
  }
  //se foi enviada imagem de perfil, procedemos com sua atualização
  if (profileImage) {
    user.profileImage = profileImage;
  }
  //se foi enviada descrição do usuário, procedemos com sua atualização
  if (bio) {
    user.bio = bio;
  }
  //agora precisamos salvar esse objeto atualizado no banco
  await user.save();
  //enviado status de OK e enviamos o usuário atualizado como resposta
  res.status(200).json(user);
};
//retornar usuário pelo ID
const getUserById = async (req, res) => {
  const { id } = req.params; //desta vez vamos pegar o id diretamente da URL, que será passado via query string
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
      "-password"
    );
    //verifica se o usuário existe
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }
    //se achou o usuário, envia-o como resposta
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }
};
module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
