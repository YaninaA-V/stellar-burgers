import { orderSlice, initialState, resetModalDataOrder } from "../src/services/order/order-slice";
import { createOrder, fetchOrder, fetchOrders } from "../src/services/order/order-actions";
import { TOrder } from "../src/utils/types";

describe('тестирование orderReducer', () => {
  it('получить исходное состояние заказа', () => {
    const state = orderSlice.reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('Синхронный экшен resetModalDataOrder', () => {
    it('проверка сброса orderModalData', () => {
      const stateWithData = {
        ...initialState,
        orderModalData: {} as TOrder
      };
      const action = resetModalDataOrder();
      const state = orderSlice.reducer(stateWithData, action);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('Асинхронные экшены', () => {
    it('проверка загрузки заказа', () => {
      const action = { type: createOrder.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
    });

    it('проверка обновления данных заказа', () => {
      const mockOrder = { _id: '1', status: 'done' } as TOrder;
      const action = {
        type: createOrder.fulfilled.type,
        payload: { order: mockOrder, name: 'Название заказа' }
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('проверка ошибок заказа', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('проверка получения списка заказов', () => {
    it('проверка загрузки списка заказов', () => {
      const action = { type: fetchOrders.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.isOrdersLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('проверка обновления списка заказов', () => {
      const mockOrders = [{ _id: '1' }, { _id: '2' }] as TOrder[];
      const action = {
        type: fetchOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.isOrdersLoading).toBe(false);
      expect(state.data).toEqual(mockOrders);
    });

    it('проверка ошибки загрузки списка заказов', () => {
      const errorMessage = 'Ошибка получения списка заказов';
      const action = {
        type: fetchOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.isOrdersLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('получение заказа', () => {
    it('проверка загрузки заказа', () => {
      const action = { type: fetchOrder.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.isOrderLoading).toBe(true);
    });

    it('проверка обновления данных заказа', () => {
      const mockOrder = { _id: '1', number: 123 } as TOrder;
      const action = {
        type: fetchOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.isOrderLoading).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('проверка ошибки загрузки данных заказа', () => {
      const errorMessage = 'Ошибка получения данных заказа';
      const action = {
        type: fetchOrder.rejected.type,
        error: { message: errorMessage },
        payload: {
          message: errorMessage
        },
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.isOrderLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});