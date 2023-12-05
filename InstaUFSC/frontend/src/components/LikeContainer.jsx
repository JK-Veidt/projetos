import "./LikeContainer.css";
//importação dos ícones de coração
import { BsHeart, BsHeartFill } from "react-icons/bs";
//como props, recebe o usuário, a foto e uma função de atribuição
const LikeContainer = ({ photo, user, handleLike }) => {
  return (
    <div className="like">
      {photo.likes && user && (
        <>
          {photo.likes.includes(user._id) ? (
            // Se o usuário já curtiu a foto, mostra o coração cheio
            <BsHeartFill />
          ) : (
            // Se o usuário ainda não curtiu a foto, mostra o coração vazio com botão de curtir
            <BsHeart onClick={() => handleLike(photo)} />
          )}
          {/* contador dos likes */}
          <p>{photo.likes.length} like(s)</p>
        </>
      )}
    </div>
  );
};
export default LikeContainer;
