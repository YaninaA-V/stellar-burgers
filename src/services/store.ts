import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userReducer from './user/user-slice';
import feedReducer from './feed/feed-slice';
import orderReducer from './order/order-slice';
import ingredientReducer from './ingredients/ingredients-slice';
import constructorReducer from './burger-constructor/burgerconstructor-slice';

const rootReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  order: orderReducer,
  ingredient: ingredientReducer,
  burgerConstructor: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
