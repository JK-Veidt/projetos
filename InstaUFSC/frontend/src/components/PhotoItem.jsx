import "./PhotoItem.css";
import { uploads } from "../utils/config";
import { NavLink } from "react-router-dom";
const PhotoItem = ({ photo }) => {
  return (
    <div className="photo-item">
      {photo.image && (
        <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
      )}
      <h2>{photo.title}</h2>
      <p className="photo-author">
        Publicada por:{" "}
        <NavLink to={`/users/${photo.userId}`}>{photo.userName}</NavLink>
      </p>
    </div>
  );
};
export default PhotoItem;
