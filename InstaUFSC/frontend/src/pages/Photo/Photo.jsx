import "./Photo.css";
import { uploads } from "../../utils/config";
import Message from "../../components/Message";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getPhoto, like, comment } from "../../slices/photoSlice";
import PhotoItem from "../../components/PhotoItem";
import LikeContainer from "../../components/LikeContainer";
import { useResetMessageComponent } from "../../hooks/useResetMessageComponent";

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const resetMessage = useResetMessageComponent(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );
  const [commentText, setCommentText] = useState("");
  //carregamento dos dados da foto
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);
  const handleLike = () => {
    dispatch(like(photo._id));
    resetMessage();
  };
  const handleComment = (e) => {
    e.preventDefault();
    const commentData = {
      comments: commentText,
      id: photo._id,
    };
    dispatch(comment(commentData));
    setCommentText("");
    resetMessage();
  };
  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
        <div className="comments">
          {photo.comments && (
            <>
              <h3>Comentários: ({photo.comments.length})</h3>
              <form onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Insira o seu comentário"
                  onChange={(e) => setCommentText(e.target.value)}
                  value={commentText}
                />
                <input type="submit" value="Enviar" />
              </form>
              {photo.comments.length === 0 && (
                <p>Não há comentários atribuídos.</p>
              )}
              {photo.comments.map((comment) => (
                // aqui é definida uma key como sendo o próprio comentário
                <div className="comment" key={comment.comments}>
                  <div className="author">
                    {comment.userImage && (
                      <img
                        src={`${uploads}/users/${comment.userImage}`}
                        alt={comment.userName}
                      />
                    )}
                    <NavLink to={`/users/${comment.userId}`}>
                      <p>{comment.userName}</p>
                    </NavLink>
                  </div>
                  <p>{comment.comments}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Photo;
