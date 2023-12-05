import "./Profile.css";
import { uploads } from "../../utils/config";
import Message from "../../components/Message";
import { NavLink } from "react-router-dom";
import {
  BsFillEyeFill, //ícone de visualização
  BsPencilFill, //ícone de edição
  BsXLg, //ícone de remoção
} from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getUserDetails } from "../../slices/userSlice";
import {
  publishPhoto,
  resetMessage,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  //aqui fazemos uma renomeação para userAuth da variável do Reducer de
  Autenticação;
  //para evitar problemas com o user do Reducer de Usuário
  const { user: userAuth } = useSelector((state) => state.auth);
  //aqui fazemos novas renomeações de variáveis do Reducer de Foto
  //para evitar problemas com aquelas do Reducer de Usuário
  const {
    photos,
    loading: loadingPhoto,
    message: messagePhoto,
    error: errorPhoto,
  } = useSelector((state) => state.photo);
  const { register, handleSubmit, reset, getValues } = useForm();
  //referência para formulário de criação e edição de fotos
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();
  const [editedPhoto, setEditedPhoto] = useState({
    editedId: "",
    editedTitle: "",
    editedImage: "",
  });
  //atualização do título da foto
  const handleEditPhoto = (e) => {
    setEditedPhoto({
      ...editedPhoto,
      [e.target.name]: e.target.value,
    });
  };
  ///carregamento de usuário
  useEffect(() => {
    dispatch(getUserDetails(id));
  }, [dispatch, id]); //será acionado com o dispatch ou com a chegada de um novo
  id;
  const resetComponentMessage = () => {
    //definimos um timeout de dois segundos, tempo de ver a mensagem
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };
  const onSubmit = async (data) => {
    let newImage = "";
    const img = getValues("image");
    if (img) {
      newImage = img[0];
    }
    const photoData = {
      title: getValues("title"),
      image: newImage,
    };
    //vamos construir um objeto form-data que será passado pela requisição
    //isso é necessário porque iremos passar um arquivo junto
    const formData = new FormData();
    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );
    formData.append("photo", photoFormData);
    await dispatch(publishPhoto(formData));
    resetComponentMessage();
  };
  const handleDelete = (id) => {
    dispatch(deletePhoto(id));
    resetComponentMessage();
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    const photoData = {
      title: editedPhoto.editedTitle,
      id: editedPhoto.editedId,
    };
    dispatch(updatePhoto(photoData));
    resetComponentMessage();
  };
  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide"); //alterna o estado do formulário de postagem
    editPhotoForm.current.classList.toggle("hide"); //alterna o estado do formulário de edição
  };
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      //se a edição está escondida, precisamos exibi-la
      hideOrShowForms();
    }
    setEditedPhoto({
      editedId: photo._id,
      editedTitle: photo.title,
      editedImage: photo.image,
    });
  };
  const handleCancelEdit = (e) => {
    e.preventDefault();
    hideOrShowForms();
  };
  const handleClickEdit = (photo) => {};
  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <span>Título para a foto:</span>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Insira um título"
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input {...register("image")} type="file" />
              </label>
              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && (
                <input type="submit" value="Aguarde..." disabled />
              )}
            </form>
          </div>
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editedPhoto.editedImage && (
              <img
                src={`${uploads}/photos/${editedPhoto.editedImage}`}
                alt={editedPhoto.editedTitle}
              />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="editedTitle"
                onChange={handleEditPhoto}
                value={editedPhoto.editedTitle}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancelar edição
              </button>
            </form>
          </div>
          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                {/* se a foto é nossa, podemos editá-la ou removê-la */}
                {/* caso contrário, só podemos visualizá-la */}
                {id === userAuth._id ? (
                  <div className="actions">
                    <NavLink to={`/photos/${photo._id}`}>
                      <BsFillEyeFill />
                    </NavLink>
                    <BsPencilFill onClick={() => handleClickEdit(photo)} />
                    <BsXLg onClick={() => handleDelete(photo._id)} />
                  </div>
                ) : (
                  <NavLink className="btn" to={`photos/${photo._id}`}>
                    Ver
                  </NavLink>
                )}
              </div>
            ))}
          {/* se não houver fotos, deixamos isso claro para o usuário */}
          {photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
        </div>
      </div>
    </div>
  );
};
export default Profile;
