import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; //para que possamos acessar os dados da nossa store
export const useAuth = () => {
  const { user } = useSelector((state) => state.auth); //extração do user do initialState do slice
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true); //para que a aplicação não mostre nada até que se saiba se o usuário está logado
  useEffect(() => {
    if (user) {
      setAuth(true);
    } else {
      setAuth(false);
    }
    setLoading(false);
  }, [user]); //será ativado sempre que o usuário logado for alterado no state do Redux;
  return { auth, loading };
};
