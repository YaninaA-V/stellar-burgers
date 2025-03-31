import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchIngredient = createAsyncThunk(
  'ingredient/fetchIngredient',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);
