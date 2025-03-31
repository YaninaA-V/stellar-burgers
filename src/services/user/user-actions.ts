import {
  loginUserApi,
  TLoginData,
  logoutApi,
  TRegisterData,
  registerUserApi,
  getUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { checkUser, clearUserData } from './user-slice';

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    const response = await loginUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
    } finally {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(clearUserData());
    }
  }
);

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (getCookie('accessToken')) {
        const response = await getUserApi();
        dispatch(checkUser(response.user));
        return response.user;
      }
    } catch (error) {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return null;
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TUser>>(
  'user/updateUser',
  async (userData) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);
