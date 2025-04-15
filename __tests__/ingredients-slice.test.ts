import { fetchIngredient } from "../src/services/ingredients/ingredients-actions";
import ingredientReducer, { initialState } from "../src/services/ingredients/ingredients-slice";
import { TIngredient } from "../src/utils/types";

describe('тестирование ingredientReducer', () => {
  it('проверка загрузки ингредиента', () => {
    const action = { type: fetchIngredient.pending.type };
    const state = ingredientReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
  });
});

it('проверка успешной загрузки ингредиентов и распределения их по категориям', () => {
  const mockIngredients = [
    { _id: '1', type: 'bun' },
    { _id: '2', type: 'main' },
    { _id: '3', type: 'sauce' }
  ] as TIngredient[];

  const action = {
    type: fetchIngredient.fulfilled.type,
    payload: mockIngredients
  };
  const state = ingredientReducer(initialState, action);

  expect(state).toEqual({
    ...initialState,
    isLoading: false,
    buns: [{ _id: '1', type: 'bun' }],
    mains: [{ _id: '2', type: 'main' }],
    sauces: [{ _id: '3', type: 'sauce' }]
});
});

it('проверка ошибок загрузки ингредиентов', () => {
  const error = new Error('Ошибка загрузки');
    const action = {
      type: fetchIngredient.rejected.type,
      error: { message: error.message }
    };
    const state = ingredientReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: { message: 'Ошибка загрузки' }
    });
});
});

describe('получить исходное состояние ингредиентов', () => {
  it('получить исходное состояние', () => {
    const state = ingredientReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});