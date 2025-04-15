import reducer, {addIngredient, moveIngredient, removeIngredient, initialState} from "../src/services/burger-constructor/burgerconstructor-slice";
import { TConstructorIngredient } from "../src/utils/types";
import { v4 as uuidv4 } from "uuid";
import { createOrder } from "../src/services/order/order-actions";

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

const mockUUID = uuidv4 as jest.MockedFunction<typeof uuidv4>;

const mockBun: TConstructorIngredient = {
  _id: "643d69a5c3f7b9001cfa093c",
  name: "Краторная булка Test",
  type: "bun",
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: "https://code.s3.yandex.net/react/code/bun-02.png",
  image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
  image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
  id: '1'
};

const mockIngredient: TConstructorIngredient = {
  _id: "643d69a5c3f7b9001cfa0941",
  name: "Биокотлета из марсианской Магнолии",
  type: "main",
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: "https://code.s3.yandex.net/react/code/meat-01.png",
  image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
  image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
  id: '2'
};

describe('Burger Constructor Reducer', () => {
  beforeEach(() => {
    mockUUID.mockReturnValue('unique-id');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('получить исходное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Добавление ингредиента', () => {
    it('тестирование добавления булки в конструктор', () => {
      const action = addIngredient(mockBun);
      const result = reducer(initialState, action);
      
      expect(result.bun).toEqual({ ...mockBun, id: 'unique-id' });
      expect(result.ingredients).toHaveLength(0);
    });

    it('тестирование замены существующей булки', () => {
      const state = { ...initialState, bun: mockBun };
      const newBun = { ...mockBun, id: '3' };
      
      const action = addIngredient(newBun);
      const result = reducer(state, action);
      
      expect(result.bun).toEqual({ ...newBun, id: 'unique-id' });
    });

    it('тестирование добавления ингредиента в список', () => {
      const action = addIngredient(mockIngredient);
      const result = reducer(initialState, action);
      
      expect(result.ingredients).toEqual([
        { ...mockIngredient, id: 'unique-id' }
      ]);
    });
  });

  describe('Удаление ингредиента', () => {
    it('тестирование удаления ингредиента по id', () => {
      const state = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      };

      const action = removeIngredient('1');
      const result = reducer(state, action);
      
      expect(result.ingredients).toEqual([{ ...mockIngredient, id: '2' }]);
    });
  });  

  describe('Создание заказа выполнено', () => {
    it('тестирование сброса состояния конструктора', () => {
      const state = {
        bun: mockBun,
        ingredients: [mockIngredient]
      };

      const mockOrder = {
        order: {
          number: 12345,
          _id: '123',
          ingredients: [],
          status: 'done',
          name: 'Test Burger',
          createdAt: '2025-04-15',
          updatedAt: '2025-04-15'
        },
        name: 'Test Burger'
      };

      const action = createOrder.fulfilled(
        mockOrder, 
        'mockedRequestId', 
        [mockBun._id, mockIngredient._id]
      );
      const result = reducer(state, action);
      
      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });
});