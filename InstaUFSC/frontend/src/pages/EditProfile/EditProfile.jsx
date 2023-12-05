import "./EditProfile.css";
import { uploads } from "../../utils/config"; //pasta de armazenamento de imagens
import { useEffect, useState } from "react"; //hooks
import { useSelector, useDispatch } from "react-redux"; //hooks do redux
import { useForm } from "react-hook-form";
import { profile, resetMessage } from "../../slices/userSlice"; //funções do reducer de usuário
import Message from "../../components/Message"; //componente de mensagens da aplicação
const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, message, error, loading } = useSelector((state) => state.user);
  //states de usuário
  const { register, handleSubmit, reset, watch, getValues } = useForm();
  const [previewImage, setPreviewImage] = useState(""); //nova imagem, caso seja
  selecionada;
  //monitoramento de mudanças do useForm
  const previewImageWatch = watch("previewImage", "");
  //sempre que um novo arquivo for selecionado, esse useEffect irá executar
  useEffect(() => {
    let newImage = "";
    const image = getValues("previewImage");
    //se não há imagem, irá atribuir uma string vazia
    if (image) {
      newImage = image[0];
    }
    //aqui atualizamos o state da pré-visualização
    setPreviewImage(newImage);
    //aqui atualizamos o state da imagem de perfil, que poderá ser salva pelo
    usuário;
    reset((previousState) => ({
      ...previousState,
      profileImage: newImage,
    }));
  }, [previewImageWatch]);
  //carregar os dados de usuário
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]); //será executado sempre que houver um dispatch deste componente
  //preenchimento inicial do formulário com dados do usuário
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        bio: user.bio,
        password: user.password,
        profileImage: user.profileImage, //imagem de perfil já existente
      });
    }
  }, [user]);
  const onSubmit = async (data) => {
    //vamos construir um objeto form-data que será passado pela requisição
    const formData = new FormData();
    const userFormData = Object.keys(data).forEach((key) =>
      formData.append(key, data[key])
    );
    formData.append("user", userFormData);
    await dispatch(updateProfile(formData));
    //definimos um timeout de dois segundos, tempo de ver a mensagem
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };
  return (
    <div id="edit-profile">
      <h2>Edite seus dados</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil e conte mais sobre você...
      </p>
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage) //imagem selecionada, mas ainda não enviada para o banco de dados
              : `${uploads}/users/${user.profileImage}` //se não escolheu imagem, mostra a que está salva no perfil
          }
        />
      )}
      {/* preview da imagem */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} type="text" placeholder="Nome" />
        {/* o input do e-mail é apenas para visualização, pois o e-mail não pode
ser alterado */}
        <input
          {...register("email")}
          type="email"
          placeholder="E-mail"
          disabled
        />
        <label>
          <span>Imagem do Perfil:</span>
          <input {...register("previewImage")} type="file" />
        </label>
        <label>
          <span>Bio:</span>
          <input
            {...register("bio")}
            type="text"
            placeholder="Descrição do perfil"
          />
        </label>
        <label>
          <span>Deseja alterar sua senha?</span>
          <input
            {...register("password")}
            type="password"
            placeholder="Digite sua nova senha"
          />
        </label>
        {!loading && <input type="submit" value="Atualizar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
        <input type="submit" value="Atualizar" />
      </form>
    </div>
  );
};
export default EditProfile;
