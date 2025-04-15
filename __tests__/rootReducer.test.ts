import store, { rootReducer } from "../src/services/store";

describe('Тестирование rootReducer', () => {
  test('Вызов rootReducer с undefined состоянием и экшеном, который возвращает корректное начальное состояние хранилища', () => {
    const before = store.getState();
    const after = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(after).toEqual(before);
  })
})