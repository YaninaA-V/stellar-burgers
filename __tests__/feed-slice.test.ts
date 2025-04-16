import feedReducer, { initialState } from "../src/services/feed/feed-slice";
import { fetchFeeds } from "../src/services/feed/feed-actions";

describe('Тестирование feedReducer', () => {
  describe('получить исходное состояние ленты заказов', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('загрузка запроса', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('результат запроса', () => {
    const mockData = { orders: [], total: 0, totalToday: 0 };
    const action = { type: fetchFeeds.fulfilled.type, payload: mockData };
    const state = feedReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      feed: mockData,
      loading: false
    });
  });

  it('ошибки запроса', () => {
    const error = { message: 'Request failed' };
    const action = { type: fetchFeeds.rejected.type, error };
    const state = feedReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: error
    });
  });
})
