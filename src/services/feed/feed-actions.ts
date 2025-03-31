import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFeeds = createAsyncThunk('feed/fetch', async () => {
  const data = await getFeedsApi();
  return data;
});
