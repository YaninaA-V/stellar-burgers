import {
  createSelector,
  createSlice,
  isPlainObject,
  SerializedError
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { checkUserAuth, login, logout, updateUser } from './user-actions';
import { RootState } from '../store';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError?: SerializedError | null;
  registerError?: SerializedError | null;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  loginError: null,
  registerError: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    checkUser: (state, action) => {
      state.user = action.payload;
    },
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    clearUserData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUser: (state: TUserState) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (isPlainObject(action.payload)) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.error;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = !!state.user;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { getUser, getIsAuthChecked } = userSlice.selectors;
export const { authCheck, checkUser, clearUserData } = userSlice.actions;
export default userSlice.reducer;
