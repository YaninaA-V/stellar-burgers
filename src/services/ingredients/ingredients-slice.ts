import { createSelector, createSlice, SerializedError } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { fetchIngredient } from './ingredients-actions';

type TIngredientsState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isLoading: boolean;
  error: null | SerializedError;
};

export const initialState: TIngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  isLoading: true,
  error: null
};

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  selectors: {
    getIngredient: createSelector(
      (state: TIngredientsState) => state,
      (ingredientState) => ({
        buns: ingredientState.buns,
        mains: ingredientState.mains,
        sauces: ingredientState.sauces,
        isLoading: ingredientState.isLoading,
        error: ingredientState.error
      })
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.buns = action.payload.filter((item) => item.type === 'bun');
        state.mains = action.payload.filter((item) => item.type === 'main');
        state.sauces = action.payload.filter((item) => item.type === 'sauce');
      })
      .addCase(fetchIngredient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export default ingredientSlice.reducer;
export const { getIngredient } = ingredientSlice.selectors;
