import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService"; //cada slice está estritamente ligado ao seu serviço
const user = JSON.parse(localStorage.getItem("user"));
const initialState = {
  user: user ? user : null,
  error: false, //estado da requisição
  success: false, //estado da requisição
  loading: false, //estado da requisição
};
//Registro de usuário no sistema
export const register = createAsyncThunk(
  "auth/register", //padrão redux: nome da entidade trabalhada / ação na API
  //o segundo parâmetro é uma função assíncrona que chama o authService
  async (user, thunkAPI) => {
    const data = await authService.register(user);
    //verificar se o backend enviou erros
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]); //será exibida sempre a primeira mensagem de erro do array
    }
    return data;
  }
);
//Logout de usuário
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});
//Login de usuário
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  const data = await authService.login(user);
  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }
  return data;
});
//as funções devem ser exportadas como "slice" para serem enviadas para a nossa store Redux
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //podemos criar quantas funções quisermos no nosso reducer
    reset: (state) => {
      //a função reset reinicilza todos os estados do componente
      state.error = false;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    //irão trabalhar diretamente com o estado atual de cada requisição
    //o builder irá 'construir' pra gente os diversos 'casos' possíveis para cada requisição;
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        //action é o 'data' que vem da requisição
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload; //registro funcionou, então passa o usuário
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; //pega o erro enviado pela thunkAPI
        state.user = null; //não há usuário registrado desta vez
      })
      .addCase(logout.fulfilled, (state, action) => {
        //depois do logout, é preciso resetar todas as variáveis
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload; //login funcionou, então passa o usuário
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; //não há usuário logado desta vez
      });
  },
});
export const { reset } = authSlice.actions;
export default authSlice.reducer;
