//Recuperar os detalhes do usuário logado
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);
  try {
    const res = await fetch(api + "/users/profile", config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res; //retorna a reposta
  } catch (error) {
    console.log(error); //loga os erros, se ocorrerem
  }
};
//Atualizar perfil de usuário
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true); //true, porque pode conter imagens
  try {
    const res = await fetch(api + "/users", config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res; //retorna a reposta
  } catch (error) {
    console.log(error); //loga os erros, caso ocorram
  }
};
//Recuperar os dados de usuário por id
const getUserDetails = async (id) => {
  const config = requestConfig("GET"); //não há token, pois podemos ver o perfil de outros usuários
  try {
    const res = await fetch(api + "/users/" + id, config) //acessa a API
      .then((res) => res.json()) //transforma os dados recebidos para JSON
      .catch((err) => err); //pega eventual erro da requisição
    return res;
  } catch (error) {
    console.log(error);
  }
};
const userService = {
  profile,
  updateProfile,
  getUserDetails,
};
export default userService;
