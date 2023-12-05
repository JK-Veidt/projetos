//importamos a função resetMessage do slice de fotos
import { resetMessage } from "../slices/photoSlice";
//o hook recebe a função de dispatch e a chama 2 segundos depois
export const useResetMessageComponent = (dispatch) => {
  return () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };
};
