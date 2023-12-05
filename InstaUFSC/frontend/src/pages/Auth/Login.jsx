import "./Auth.css";
import { NavLink } from "react-router-dom";
import Message from "../../components/Message";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../slices/authSlice";
const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  //o dispatch é quem nos possibilita chamarmos as funções Redux
  const dispatch = useDispatch();
  //o useSelector nos permite pegar qualquer state de qualquer contexto/reducer (neste caso, auth) do sistema
  const { loading, error } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    setUser({
      //spread operator, mantém a estrutura inicial e adiciona nova informação
      ...user,
      //tanto o valor quanto o nome do campo são dinâmicos
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    dispatch(login(user)); //chama a função de login de usuário que irá acionar a API
  };
  //criamos um useEffect para chamar a função reset sempre que outra função for executada
  //assim, podemos reinicilizar os estados do componente
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]); //o useEffect irá monitorar cada dispatch executado
  return (
    <div id="login">
      <h2>InstaUFSC</h2>
      <p className="subtitle">Faça o login para ver as novidades.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="E-mail"
          name="email"
          onChange={handleChange}
          value={user.email}
        />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          onChange={handleChange}
          value={user.password}
        />
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
        <p>
          Não possui cadastro? <NavLink to="/register">Clique aqui</NavLink>
        </p>
      </form>
    </div>
  );
};
export default Login;
