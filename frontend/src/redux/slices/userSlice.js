import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,   // yahan login user ka data ayega
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // payload = user data (e.g., {id, name, email})
    },
    logout: (state) => {
      state.user = null; // logout hone pe user null ho jaye
    },
  },
});

// Actions export karo
export const { login, logout } = userSlice.actions;

// Reducer export karo
export default userSlice.reducer;
