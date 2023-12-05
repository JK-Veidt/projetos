import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EditProfile from "./pages/EditProfile/EditProfile";
import { useAuth } from "./hooks/useAuth";
import Profile from "./pages/Profile/Profile";
import Photo from "./pages/Photo/Photo";
import Search from "./pages/Search/Search";
function App() {
  //pegamos as informações exportadas pelo nosso hook
  const { auth, loading } = useAuth();
  //se está no estado de carregamento, apenas indica isso para o usuário
  if (loading) {
    return <p>Carregando aplicação...</p>;
  }
  return (
    <>
      <div>
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Routes>
              {/* só pode acessar a Home se estiver autenticado, senão vai para o
 Login */}
              <Route
                path="/"
                element={auth ? <Home /> : <Navigate to="/login" />}
              />
              {/* só pode acessar o Login se não estiver autenticado, senão vai
 pra Home */}
              <Route
                path="/login"
                element={!auth ? <Login /> : <Navigate to="/" />}
              />
              {/* só pode acessar o Register se não estiver autenticado, senão vai
 pra Home */}
              <Route
                path="/register"
                element={!auth ? <Register /> : <Navigate to="/" />}
              />
              {/* só pode acessar a página de perfil se estiver autenticado, senão vai para o
Login */}
              <Route
                path="/profile"
                element={auth ? <EditProfile /> : <Navigate to="/login" />}
              />
              {/* só pode acessar a página de postagem de fotos se estiver autenticado, senão
vai para o Login */}
              <Route
                path="/users/:id"
                element={auth ? <Profile /> : <Navigate to="/login" />}
              />
              {/* só pode acessar a foto individualmente se estiver autenticado, senão vai para
o Login */}
              <Route
                path="/photos/:id"
                element={auth ? <Photo /> : <Navigate to="/login" />}
              />
              {/* só pode acessar a busca se estiver autenticado, senão vai para o Login */}
              <Route
                path="/search"
                element={auth ? <Search /> : <Navigate to="/login" />}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}
export default App;
