import { api, requestConfig } from "../utils/config.jsx";
//publicação de fotos
const publishPhoto = async (data, token) => {
  const config = requestConfig("POST", data, token, true); //true porque há imagem
  envolvida;
  try {
    const res = await fetch(api + "/photos", config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//resgate de fotos de usuário
const getUserPhotos = async (id, token) => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(api + "/photos/user/" + id, config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//exclusão de foto
const deletePhoto = async (id, token) => {
  const config = requestConfig("DELETE", null, token);
  try {
    const res = await fetch(api + "/photos/" + id, config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//atualização de foto
const updatePhoto = async (data, id, token) => {
  const config = requestConfig("PATCH", data, token);
  try {
    const res = await fetch(api + "/photos/" + id, config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//retornar foto por id
const getPhoto = async (id, token) => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(api + "/photos/" + id, config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//atribuição de likes
const like = async (id, token) => {
  const config = requestConfig("PATCH", null, token);
  try {
    const res = await fetch(api + "/photos/like/" + id, config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//atribuição de comentários
const comment = async (data, id, token) => {
  const config = requestConfig("PATCH", data, token);
  try {
    const res = await fetch(api + "/photos/comment/" + id, config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//recuperação de todas as fotos
const getPhotos = async (token) => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(api + "/photos", config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//busca de fotos por título
const searchPhotos = async (query, token) => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(api + "/photos/search?q=" + query, config) //passa a query e acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};

const photoService = {
  publishPhoto,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
  getPhoto,
  like,
  comment,
  getPhotos,
  searchPhotos,
};
export default photoService;
