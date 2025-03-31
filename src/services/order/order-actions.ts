import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('order/create', async (data, { rejectWithValue }) => {
  const response = await orderBurgerApi(data);
  if (!response?.success) return rejectWithValue(response);
  return { order: response.order, name: response.name };
});

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async () => await getOrdersApi()
);

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'order/fetchOrder',
  async (number, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(number);
    if (!response?.success) return rejectWithValue(response);
    return response.orders[0];
  }
);
