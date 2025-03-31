import { createSlice, SerializedError } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { fetchFeeds } from './feed-actions';

type TFeedState = {
  feed: TOrdersData | null;
  loading: boolean;
  error: null | SerializedError;
};

export const initialState: TFeedState = {
  feed: null,
  loading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeeds: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.feed = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error ?? null;
      });
  }
});

export default feedSlice.reducer;
export const { getFeeds } = feedSlice.selectors;
