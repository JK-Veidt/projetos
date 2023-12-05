//importação de elementos do nosso arquivo de configuração
import { api, requestConfig } from "../utils/config";
//Registro de usuário no sistema
const register = async (data) => {
  const config = requestConfig("POST", data);
  //estrutura try-catch, porque é preciso verificar se houve algum erro na
  requisição;
  try {
    //criamos uma requisição e aguardamos que um fetch seja feito na API
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err); //se cair nesse catch aqui, irá automaticamente para o catch do try/catch
    if (res._id) {
      //se uma resposta for recebida, o backend envia um usuário
      //o usuário é composto pelo ID e pelo token
      //iremos salvar na localStorage, um espaço de armazenamento do browser
      //para salvarmos o usuário correntemente logado
      //porém, só irá salvar na localStorage se o usuário possuir _id
      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  } catch (error) {
    console.log(error); //se houver um erro, mostramos ele no console
  }
};
//Logout de usuário
const logout = async () => {
  localStorage.removeItem("user");
};
//Login de usuário
const login = async (data) => {
  const config = requestConfig("POST", data); //o login também é uma função do tipo POST
  try {
    const res = await fetch(api + "/users/login", config)
      .then((res) => res.json())
      .catch((err) => err);
    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};
const authService = {
  register,
  logout,
  login,
};

export default authService;
